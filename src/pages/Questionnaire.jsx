import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { Save, Image as ImageIcon, Loader2, Lock } from "lucide-react";
import { Button } from '@/components/ui/button';
import { getStore, setAnswer, updateStore, useStore } from '@/lib/store';
import { toast } from 'sonner';
import { cn, assessBrandLevel, getQuestionAccess, TIERS } from "@/lib/utils";
import { getPermissionMatrix, getTierComparison } from "@/lib/accessControl";
import { analyzeVisualConsistency } from '@/lib/gemini';
import { SEED_QUESTIONNAIRE } from '@/data/questionnaires/v3/seed';
import { SPROUT_QUESTIONNAIRE } from '@/data/questionnaires/v3/sprout';
import { STAR_QUESTIONNAIRE } from '@/data/questionnaires/v3/star';
import { SUPERBRAND_QUESTIONNAIRE } from '@/data/questionnaires/v3/superbrand';
import QuestionCard from '@/components/audit/QuestionCard';
import ReportGenerator from '@/components/reports/ReportGenerator';

const Tabs = TabsPrimitive.Root;
const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List ref={ref} className={cn("inline-flex h-10 items-center justify-start rounded-md bg-slate-100 p-1 text-slate-500 w-full mb-6", className)} {...props} />
));
TabsList.displayName = TabsPrimitive.List.displayName;
const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger ref={ref} className={cn("inline-flex items-center justify-center whitespace-nowrap rounded-sm px-4 py-2 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm data-[state=active]:font-bold", className)} {...props} />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content ref={ref} className={cn("mt-2 focus-visible:outline-none", className)} {...props} />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

const Badge = ({ children, className }) => (
  <span className={cn("inline-flex items-center rounded-sm bg-orange-100 px-2 py-1 text-xs font-bold text-orange-600 uppercase tracking-wide", className)}>
    {children}
  </span>
);

const TAB_ORDER = ['brand_core', 'visual_identity', 'product_experience', 'market_plan', 'technology', 'brand_activation', 'team_branding', 'security_trust'];
const TAB_LABELS = {
  brand_core: 'Brand Core',
  visual_identity: 'Visual Identity',
  product_experience: 'Product Experience',
  market_plan: 'Market Plan',
  technology: 'Technology',
  brand_activation: 'Brand Activation',
  team_branding: 'Team Branding',
  security_trust: 'Security & Trust'
};

const PILLAR_KEY_BY_ID = {
  1: 'brand_core',
  2: 'visual_identity',
  3: 'product_experience',
  4: 'market_plan',
  5: 'technology',
  6: 'brand_activation',
  7: 'team_branding',
  8: 'security_trust'
};

const normalizeQuestionType = (type) => {
  if (type === 'textarea') return 'textarea';
  if (type === 'text') return 'text';
  return 'text';
};

const buildV3Data = () => {
  const tierData = [
    { tier: 'Seed', data: SEED_QUESTIONNAIRE },
    { tier: 'Sprout', data: SPROUT_QUESTIONNAIRE },
    { tier: 'Star', data: STAR_QUESTIONNAIRE },
    { tier: 'Superbrand', data: SUPERBRAND_QUESTIONNAIRE }
  ];

  const pillarsByKey = {};
  const flatByKey = {};

  TAB_ORDER.forEach((key) => {
    pillarsByKey[key] = [];
    flatByKey[key] = [];
  });

  tierData.forEach(({ tier, data }) => {
    data.forEach((pillar) => {
      const pillarKey = PILLAR_KEY_BY_ID[pillar.pillarId];
      if (!pillarKey) return;
      pillar.sections.forEach((section) => {
        const mappedQuestions = (section.questions || []).map((question) => ({
          id: question.id,
          label: question.text,
          subLabel: question.helperText,
          placeholder: question.helperText || '',
          type: normalizeQuestionType(question.type),
          tier
        }));

        pillarsByKey[pillarKey].push({
          title: section.title,
          description: section.description,
          questions: mappedQuestions,
          checklist: section.checklist,
          tier
        });

        flatByKey[pillarKey].push(...mappedQuestions);
      });
    });
  });

  return { pillarsByKey, flatByKey };
};

const Questionnaire = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("brand_core");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [visualAnalysis, setVisualAnalysis] = useState(null);
  const answers = useStore((state) => state.answers || {});
  const ratings = useStore((state) => state.ratings || {});
  const currentTier = useStore((state) => state.brandLevel?.level || state.userTier || 'Seed');
  const previousTierRef = useRef(currentTier);
  const { pillarsByKey, flatByKey } = useMemo(() => buildV3Data(), []);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && TAB_ORDER.includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    const prevTier = previousTierRef.current;
    if (prevTier !== currentTier) {
      const prevIndex = TIERS.indexOf(prevTier);
      const nextIndex = TIERS.indexOf(currentTier);
      if (nextIndex > prevIndex) {
        toast.success(`Congratulations! You've reached ${currentTier} Level. Your AI Mentor is now more technical.`);
      }
      previousTierRef.current = currentTier;
    }
  }, [currentTier]);

  const runVisualCheck = async () => {
    setIsAnalyzing(true);
    try {
      const logo = answers['visual_logo'];
      const colors = [answers['visual_palette_primary']].filter(Boolean);
      if (!logo) {
        toast.error("Please upload a logo first.");
        return;
      }
      if (colors.length === 0) {
        toast.error("Please select a primary brand color.");
        return;
      }
      const analysis = await analyzeVisualConsistency(logo, colors);
      setVisualAnalysis(analysis);
    } catch (error) {
      toast.error("Failed to analyze visuals");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = () => {
    const current = getStore();
    const prevLevel = current.brandLevel?.level || current.userTier || 'Seed';
    const assessment = assessBrandLevel(answers, ratings, prevLevel);
    const levelHistory = [...(current.levelHistory || [])];
    const levelAuditLog = [...(current.levelAuditLog || [])];
    const permissionAuditLog = [...(current.permissionAuditLog || [])];

    if (assessment.historyEntry) levelHistory.push(assessment.historyEntry);
    if (assessment.auditEntry) levelAuditLog.push(assessment.auditEntry);

    if (assessment.levelChanged) {
      permissionAuditLog.push({
        timestamp: assessment.updatedAt,
        action: 'permission_change',
        from: prevLevel,
        to: assessment.level,
        fromPermissions: getPermissionMatrix(prevLevel),
        toPermissions: getPermissionMatrix(assessment.level)
      });
    }

    const brandLevel = {
      level: assessment.level,
      score: assessment.score,
      metrics: assessment.metrics,
      updatedAt: assessment.updatedAt
    };

    updateStore({
      answers,
      ratings,
      brandLevel,
      levelHistory,
      levelAuditLog,
      permissionAuditLog,
      userTier: assessment.level
    });

    if (assessment.levelChanged) {
      const direction = assessment.levelIndexChange > 0 ? 'upgraded' : 'adjusted';
      toast.success(`Brand level ${direction} to ${assessment.level}`);
      return;
    }

    if (assessment.blockedReason) {
      toast.error(`Level update blocked: ${assessment.blockedReason.replace(/_/g, ' ')}`);
      return;
    }

    toast.success("Progress saved!");
  };

  const tierComparison = getTierComparison(flatByKey, currentTier);
  const higherTierEntries = Object.entries(tierComparison);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Brand Audit Questionnaire</h1>
          <p className="text-slate-500 mt-1">Focus on foundational questions to build your brand core</p>
        </div>
        <div className="flex gap-3">
          <ReportGenerator />
          <Button onClick={handleSave} className="bg-indigo-900 hover:bg-indigo-800">
            <Save className="w-4 h-4 mr-2" /> Save Progress
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          {TAB_ORDER.map((tab) => {
            const tabTier = flatByKey[tab]?.[0]?.tier || 'Seed';
            const locked = getQuestionAccess(tabTier, currentTier).isLocked;
            return (
              <TabsTrigger key={tab} value={tab}>
                <span className="flex items-center gap-2">
                  {TAB_LABELS[tab]}
                  {locked ? <Lock className="w-3 h-3 text-slate-400" /> : null}
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {TAB_ORDER.filter((tab) => tab !== 'visual_identity').map((tab) => (
          <TabsContent key={tab} value={tab} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="space-y-8">
              {pillarsByKey[tab].map((section, sectionIndex) => {
                const access = getQuestionAccess(section.tier, currentTier);
                const locked = access.isLocked;
                return (
                  <div key={`${tab}-${sectionIndex}`} className="space-y-4">
                    <div className="rounded-xl border border-slate-100 bg-white p-5">
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-semibold text-slate-900">{section.title}</div>
                        {locked ? (
                          <span className="inline-flex items-center rounded-sm bg-slate-200 px-2 py-1 text-xs font-bold text-slate-700 uppercase tracking-wide">Locked</span>
                        ) : null}
                      </div>
                      {section.description ? (
                        <p className="text-sm text-slate-500 mt-1">{section.description}</p>
                      ) : null}
                    </div>

                    {section.questions.map((question) => (
                      <QuestionCard key={question.id} question={question} userTier={currentTier} />
                    ))}

                    {section.checklist ? (
                      <div className={cn("rounded-xl border border-slate-100 bg-white p-5 space-y-4", access.blurAmount)}>
                        <div>
                          <div className="text-base font-semibold text-slate-900">{section.checklist.title}</div>
                          <p className="text-sm text-slate-500">{section.checklist.description}</p>
                        </div>
                        <div className={cn("space-y-3", locked ? "opacity-60 pointer-events-none" : "")}>
                          {section.checklist.items.map((item) => {
                            const checked = Boolean(answers[item.id]);
                            return (
                              <label key={item.id} className="flex items-start gap-3 text-sm text-slate-700">
                                <input
                                  type="checkbox"
                                  className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                                  checked={checked}
                                  onChange={(e) => setAnswer(item.id, e.target.checked)}
                                  disabled={locked}
                                />
                                <span>{item.label}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </TabsContent>
        ))}

        <TabsContent value="visual_identity" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="space-y-8">
            {pillarsByKey.visual_identity.map((section, sectionIndex) => {
              const access = getQuestionAccess(section.tier, currentTier);
              const locked = access.isLocked;
              return (
                <div key={`visual-${sectionIndex}`} className="space-y-4">
                  <div className="rounded-xl border border-slate-100 bg-white p-5">
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-semibold text-slate-900">{section.title}</div>
                      {locked ? (
                        <span className="inline-flex items-center rounded-sm bg-slate-200 px-2 py-1 text-xs font-bold text-slate-700 uppercase tracking-wide">Locked</span>
                      ) : null}
                    </div>
                    {section.description ? (
                      <p className="text-sm text-slate-500 mt-1">{section.description}</p>
                    ) : null}
                  </div>

                  {section.questions.map((question) => (
                    <QuestionCard key={question.id} question={question} userTier={currentTier} />
                  ))}

                  {section.checklist ? (
                    <div className={cn("rounded-xl border border-slate-100 bg-white p-5 space-y-4", access.blurAmount)}>
                      <div>
                        <div className="text-base font-semibold text-slate-900">{section.checklist.title}</div>
                        <p className="text-sm text-slate-500">{section.checklist.description}</p>
                      </div>
                      <div className={cn("space-y-3", locked ? "opacity-60 pointer-events-none" : "")}>
                        {section.checklist.items.map((item) => {
                          const checked = Boolean(answers[item.id]);
                          return (
                            <label key={item.id} className="flex items-start gap-3 text-sm text-slate-700">
                              <input
                                type="checkbox"
                                className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                                checked={checked}
                                onChange={(e) => setAnswer(item.id, e.target.checked)}
                                disabled={locked}
                              />
                              <span>{item.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          <div className="mt-8 p-6 bg-indigo-50 rounded-xl border border-indigo-100">
            <h3 className="text-xl font-bold text-indigo-900 mb-2 flex items-center gap-2">
              <ImageIcon className="w-5 h-5" /> Visual Consistency Checker
            </h3>
            <p className="text-indigo-700 mb-6">
              AI will analyze your Logo against your Color Palette to ensure emotional alignment and legibility.
            </p>

            {visualAnalysis ? (
              <div className="bg-white p-6 rounded-lg shadow-sm animate-in fade-in">
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-2xl font-black ${visualAnalysis.score > 70 ? 'text-green-600' : 'text-orange-600'}`}>
                    Score: {visualAnalysis.score}/100
                  </span>
                  <Badge className={visualAnalysis.score > 70 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}>
                    {visualAnalysis.status}
                  </Badge>
                </div>
                <p className="text-slate-700 font-medium mb-4">{visualAnalysis.analysis}</p>
                <h4 className="font-bold text-slate-900 mb-2 text-sm uppercase tracking-wide">Improvements:</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600 text-sm">
                  {visualAnalysis.improvements.map((imp, i) => <li key={i}>{imp}</li>)}
                </ul>

                <Button onClick={() => setVisualAnalysis(null)} variant="outline" className="mt-6 w-full">
                  Run New Analysis
                </Button>
              </div>
            ) : (
              <Button 
                onClick={runVisualCheck} 
                disabled={isAnalyzing}
                className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 text-lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyzing Visuals...
                  </>
                ) : (
                  "Analyze My Brand Consistency"
                )}
              </Button>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {higherTierEntries.length > 0 && (
        <div className="mt-10 rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Higher Tier Preview</h2>
            <Badge className="bg-slate-200 text-slate-700">Locked</Badge>
          </div>
          <div className="grid gap-4">
            {higherTierEntries.map(([tier, questions]) => (
              <div key={tier} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold uppercase tracking-wide text-slate-600">{tier} Questions</h3>
                  <Badge className="bg-slate-200 text-slate-700">Read-only</Badge>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600">
                  {questions.map((label, idx) => (
                    <li key={`${tier}-${idx}`}>{label}</li>
                  ))}
                </ul>
                <Button variant="outline" className="mt-4" onClick={() => navigate('/settings')}>
                  Upgrade to {tier}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Questionnaire;
