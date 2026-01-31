import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { ChevronDown, Circle, Lightbulb, Save, Image as ImageIcon, Plus, Type, Palette, Loader2, Sparkles } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { getStore, updateStore } from '@/lib/store';
import { toast } from 'sonner';
import { cn, assessBrandLevel } from "@/lib/utils";
import { buildQuestionIndex, getPermissionMatrix, getQuestionAccess, getQuestionVariant, authorizeSubmission, getTierComparison } from "@/lib/accessControl";
import { analyzeVisualConsistency, analyzeSingleInput } from '@/lib/gemini';

// --- INLINE UI COMPONENTS ---

// TABS
const Tabs = TabsPrimitive.Root
const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List ref={ref} className={cn("inline-flex h-10 items-center justify-start rounded-md bg-slate-100 p-1 text-slate-500 w-full mb-6", className)} {...props} />
))
TabsList.displayName = TabsPrimitive.List.displayName
const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger ref={ref} className={cn("inline-flex items-center justify-center whitespace-nowrap rounded-sm px-4 py-2 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm data-[state=active]:font-bold", className)} {...props} />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName
const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content ref={ref} className={cn("mt-2 focus-visible:outline-none", className)} {...props} />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

// ACCORDION
const Accordion = AccordionPrimitive.Root
const AccordionItem = React.forwardRef(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn("border rounded-lg bg-white mb-4 overflow-hidden shadow-sm", className)} {...props} />
))
AccordionItem.displayName = "AccordionItem"
const AccordionTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger ref={ref} className={cn("flex flex-1 items-center justify-between px-6 py-4 font-bold text-lg text-slate-800 transition-all hover:bg-slate-50 [&[data-state=open]>svg]:rotate-180", className)} {...props}>
      {children}
      <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200 text-slate-400" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName
const AccordionContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content ref={ref} className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down" {...props}>
    <div className={cn("px-6 pb-6 pt-2 border-t", className)}>{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

// RADIO GROUP
const RadioGroup = React.forwardRef(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root className={cn("flex gap-4", className)} {...props} ref={ref} />
))
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName
const RadioGroupItem = React.forwardRef(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item ref={ref} className={cn("aspect-square h-5 w-5 rounded-full border border-slate-300 text-indigo-600 ring-offset-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-indigo-600 data-[state=checked]:text-indigo-600", className)} {...props}>
    <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
      <Circle className="h-3 w-3 fill-current text-current" />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
))
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

// BADGE
const Badge = ({ children, className }) => (
  <span className={cn("inline-flex items-center rounded-sm bg-orange-100 px-2 py-1 text-xs font-bold text-orange-600 uppercase tracking-wide", className)}>
    {children}
  </span>
)

// --- QUESTIONNAIRE DATA ---
import { SECTIONS } from '@/lib/constants';

const TAB_ORDER = ['brand_core', 'visual', 'product', 'market', 'tech', 'brand_activation', 'team_branding', 'security_trust'];
const TAB_LABELS = {
  'brand_core': 'Brand Core Story & Ideation',
  'visual': 'Visual Identity',
  'product': 'Product Experience',
  'market': 'Market Plan',
  'tech': 'Technology & Accessibility',
  'brand_activation': 'Brand Activation',
  'team_branding': 'Team Branding',
  'security_trust': 'Security & Trust'
};

const Questionnaire = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("brand_core");
  const [answers, setAnswers] = useState({});
  const [ratings, setRatings] = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [visualAnalysis, setVisualAnalysis] = useState(null);
  const [analyzingId, setAnalyzingId] = useState(null);
  const [feedback, setFeedback] = useState({});
  const [currentTier, setCurrentTier] = useState('Seed');

  const questionIndex = React.useMemo(() => buildQuestionIndex(SECTIONS), []);

  useEffect(() => {
    const store = getStore();
    if (store.answers) setAnswers(store.answers);
    if (store.ratings) setRatings(store.ratings);
    setCurrentTier(store.brandLevel?.level || store.userTier || 'Seed');
  }, []);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && TAB_ORDER.includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const feedbackTimeouts = React.useRef({});

  const recordPermissionAudit = (entry) => {
    const current = getStore();
    const nextLog = [...(current.permissionAuditLog || []), entry];
    updateStore({ permissionAuditLog: nextLog });
  };

  const guardSubmission = (qId) => {
    const question = questionIndex[qId];
    try {
      return authorizeSubmission(question, currentTier);
    } catch (error) {
      recordPermissionAudit({
        timestamp: new Date().toISOString(),
        action: 'submit_blocked',
        tier: currentTier,
        questionId: qId,
        reason: error.reason || 'forbidden'
      });
      throw error;
    }
  };

  const handleGetFeedback = async (qId, questionText, currentAnswer) => {
    const answer = currentAnswer || answers[qId];
    if (!answer) {
      console.log("No answer to analyze");
      return;
    }

    setAnalyzingId(qId);
    try {
      const store = getStore();
      const apiKey = store.apiKey;
      if (!apiKey) {
        console.log("No API key found");
        return;
      }

      console.log("Analyzing:", qId);
      const feedbackText = await analyzeSingleInput(apiKey, questionText, answer);
      setFeedback(prev => ({ ...prev, [qId]: feedbackText }));
    } catch (error) {
      console.error("Auto feedback error:", error);
    } finally {
      setAnalyzingId(null);
    }
  };

  const handleTextChange = (id, value) => {
    try {
      guardSubmission(id);
    } catch (error) {
      if (error.status === 403) {
        toast.error(`403 Forbidden: ${error.reason || 'not allowed'}`);
        return;
      }
      throw error;
    }
    const newAnswers = { ...answers, [id]: value };
    setAnswers(newAnswers);
    updateStore({ answers: newAnswers });

    // Debounce auto-feedback
    if (feedbackTimeouts.current[id]) {
      clearTimeout(feedbackTimeouts.current[id]);
    }

    if (value.length > 10) {
      feedbackTimeouts.current[id] = setTimeout(() => {
        // Find label
        let label = '';
        Object.values(SECTIONS).forEach(sec => {
          sec.forEach(sub => {
            const q = sub.questions.find(q => q.id === id);
            if (q) label = q.label;
          });
        });
        
        if (label) {
          handleGetFeedback(id, label, value);
        }
      }, 1500);
    }
  };

  const handleRatingChange = (id, value) => {
    try {
      guardSubmission(id);
    } catch (error) {
      if (error.status === 403) {
        toast.error(`403 Forbidden: ${error.reason || 'not allowed'}`);
        return;
      }
      throw error;
    }
    const newRatings = { ...ratings, [id]: value };
    setRatings(newRatings);
    updateStore({ ratings: newRatings });
  };

  const handleFileUpload = (qId, e) => {
    try {
      guardSubmission(qId);
    } catch (error) {
      if (error.status === 403) {
        toast.error(`403 Forbidden: ${error.reason || 'not allowed'}`);
        return;
      }
      throw error;
    }
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size too large (max 5MB)");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        const newAnswers = { ...answers, [qId]: base64 };
        setAnswers(newAnswers);
        updateStore({ answers: newAnswers });
        toast.success("File uploaded successfully");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorChange = (qId, e) => {
    try {
      guardSubmission(qId);
    } catch (error) {
      if (error.status === 403) {
        toast.error(`403 Forbidden: ${error.reason || 'not allowed'}`);
        return;
      }
      throw error;
    }
    const color = e.target.value;
    const newAnswers = { ...answers, [qId]: color };
    setAnswers(newAnswers);
    updateStore({ answers: newAnswers });
  };

  const runVisualCheck = async () => {
    try {
      guardSubmission('logo_upload');
    } catch (error) {
      if (error.status === 403) {
        toast.error(`403 Forbidden: ${error.reason || 'not allowed'}`);
        return;
      }
      throw error;
    }
    const logo = answers['logo_upload'];
    // Try primary or secondary colors
    const colors = [answers['colors_primary'], answers['colors_secondary']].filter(Boolean);

    if (!logo) {
      toast.error("Please upload a logo first.");
      return;
    }
    if (colors.length === 0) {
      toast.error("Please select at least one brand color.");
      return;
    }

    setIsAnalyzing(true);
    try {
      const store = getStore();
      const apiKey = store.apiKey;
      
      if (!apiKey) {
        toast.error("Please set your Gemini API Key in Settings first.");
        setIsAnalyzing(false);
        return;
      }

      const result = await analyzeVisualConsistency(apiKey, logo, colors);
      setVisualAnalysis(result);
      toast.success("Analysis Complete!");
    } catch (error) {
      console.error(error);
      toast.error("Analysis failed. Please check your API Key and try again.");
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
    setCurrentTier(assessment.level);

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

  const renderQuestion = (q) => {
    const variant = getQuestionVariant(q, currentTier);
    const access = getQuestionAccess(q, currentTier);
    const disabled = !access.canSubmit;
    const lockLabel = access.readOnly ? `Read-only: ${access.questionTier}` : null;
    // UPLOAD (Logo)
    if (q.type === 'upload') {
      const hasImage = answers[q.id];
      return (
        <div key={q.id} className="mb-8 p-4 bg-slate-50 rounded-lg border border-slate-100">
           {lockLabel && (
             <div className="mb-3">
               <Badge className="bg-slate-200 text-slate-700">{lockLabel}</Badge>
             </div>
           )}
           <div className="grid md:grid-cols-2 gap-6 mb-4">
              {[variant.label, variant.subLabel].filter(Boolean).map((lbl, idx) => (
                <div key={idx}>
                  <label className="text-base font-semibold text-slate-900 block mb-2">{lbl}</label>
                  <label 
                    htmlFor={q.id}
                    className={cn("border-2 border-dashed border-slate-300 rounded-lg p-8 flex flex-col items-center justify-center text-center transition-colors bg-white group relative overflow-hidden", disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:bg-slate-100")}
                  >
                    <input 
                      type="file" 
                      id={q.id} 
                      className="hidden" 
                      accept="image/*"
                      disabled={disabled}
                      onChange={(e) => handleFileUpload(q.id, e)}
                    />
                    
                    {hasImage && idx === 0 ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-white">
                        <img src={hasImage} alt="Uploaded Logo" className="max-h-full max-w-full object-contain p-2" />
                        <div className={cn("absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity", disabled ? "opacity-0" : "opacity-0 group-hover:opacity-100")}>
                          <span className="text-white font-medium">Click to Change</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className={cn("bg-slate-100 p-3 rounded-full mb-3 transition-colors", disabled ? "" : "group-hover:bg-indigo-50")}>
                          <ImageIcon className={cn("w-6 h-6 text-slate-400", disabled ? "" : "group-hover:text-indigo-500")} />
                        </div>
                        <span className="text-sm font-medium text-slate-700">Click to upload logo</span>
                        <span className="text-xs text-slate-400 mt-1">PNG, JPG, SVG (MAX 5MB)</span>
                      </>
                    )}
                  </label>
                </div>
              ))}
           </div>
        </div>
      );
    }
    
    // UPLOAD GRID (Imagery)
    if (q.type === 'upload_grid') {
      return (
        <div key={q.id} className="mb-8 p-4 bg-slate-50 rounded-lg border border-slate-100">
          <div className="flex items-start justify-between mb-4">
            <label className="text-base font-semibold text-slate-900 block">{variant.label}</label>
            {lockLabel && <Badge className="bg-slate-200 text-slate-700">{lockLabel}</Badge>}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={cn("aspect-square border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-center transition-colors bg-white group", disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:bg-slate-100")}>
                <div className={cn("bg-slate-100 p-2 rounded-full mb-2 transition-colors", disabled ? "" : "group-hover:bg-indigo-50")}>
                  <ImageIcon className={cn("w-5 h-5 text-slate-400", disabled ? "" : "group-hover:text-indigo-500")} />
                </div>
                <span className="text-xs text-slate-500">Upload Image</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // COLOR PICKER
    if (q.type === 'color') {
      const selectedColor = answers[q.id] || '#ffffff';
      return (
        <div key={q.id} className="mb-6">
          <div className="flex items-start justify-between mb-2">
            <label className="text-base font-semibold text-slate-900 block">{variant.label}</label>
            {lockLabel && <Badge className="bg-slate-200 text-slate-700">{lockLabel}</Badge>}
          </div>
          <div className="flex gap-3 items-center">
            <div className={cn("relative w-16 h-16 rounded-md border-2 border-slate-200 overflow-hidden shadow-sm", disabled ? "opacity-60" : "")}>
              <input 
                type="color" 
                value={selectedColor}
                onChange={(e) => handleColorChange(q.id, e)}
                disabled={disabled}
                className={cn("absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] p-0 border-0", disabled ? "cursor-not-allowed" : "cursor-pointer")}
              />
            </div>
            {answers[q.id] ? (
               <span className="text-sm font-mono bg-slate-100 px-2 py-1 rounded text-slate-600 border border-slate-200">
                 {answers[q.id]}
               </span>
            ) : (
               <span className="text-sm text-slate-400 italic">Click box to select</span>
            )}
          </div>
        </div>
      );
    }

    // FONT PICKER
    if (q.type === 'font') {
      return (
        <div key={q.id} className="mb-6">
          <div className="flex items-start justify-between mb-2">
            <label className="text-base font-semibold text-slate-900 block">{variant.label}</label>
            {lockLabel && <Badge className="bg-slate-200 text-slate-700">{lockLabel}</Badge>}
          </div>
          <Button variant="outline" className="gap-2" disabled={disabled}>
            <Plus className="w-4 h-4" /> Add Font
          </Button>
        </div>
      );
    }

    // TEXTAREA (Default)
    return (
      <div key={q.id} className="mb-8 p-4 bg-slate-50 rounded-lg border border-slate-100">
        <div className="flex justify-between items-start mb-2">
          <label className="text-base font-semibold text-slate-900 block mb-2">{variant.label}</label>
          <div className="flex gap-2">
            {variant.recommended === "SEED" && <Badge>Recommended for Seed</Badge>}
            {lockLabel && <Badge className="bg-slate-200 text-slate-700">{lockLabel}</Badge>}
          </div>
        </div>

        <Textarea
          value={answers[q.id] || ''}
          onChange={(e) => handleTextChange(q.id, e.target.value)}
          placeholder={variant.placeholder}
          readOnly={disabled}
          disabled={disabled}
          className={cn("min-h-[120px] bg-white border-slate-300 focus:border-indigo-500 mb-2", disabled ? "opacity-60 cursor-not-allowed" : "")}
        />

        <div className="flex justify-between items-start mb-4">
           {/* Tips Section */}
           <div className="text-xs text-slate-500 max-w-[70%]">
             {variant.tips && (
               <div className="bg-blue-50 p-2 rounded border border-blue-100 flex gap-2">
                 <Lightbulb className="w-4 h-4 text-blue-500 shrink-0" />
                 <div>
                   <span className="font-semibold text-blue-700 block mb-1">Tip:</span>
                   <ul className="list-disc pl-4 space-y-1">
                     {variant.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                   </ul>
                 </div>
               </div>
             )}
           </div>

           {/* Auto Feedback Indicator */}
           {analyzingId === q.id && (
             <div className="flex items-center gap-2 text-sm text-indigo-600 animate-pulse">
               <Loader2 className="w-4 h-4 animate-spin" />
               <span>AI is thinking...</span>
             </div>
           )}
        </div>

        {/* AI Feedback Display */}
        {feedback[q.id] && (
          <div className="mt-2 p-3 bg-indigo-50 border border-indigo-100 rounded-lg animate-in fade-in slide-in-from-top-2">
            <div className="flex gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-indigo-900 font-medium mb-1">AI Feedback:</p>
                <p className="text-sm text-slate-700 leading-relaxed">{feedback[q.id]}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-slate-200">
           <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Rate your current state:</label>
           <RadioGroup 
             onValueChange={(val) => handleRatingChange(q.id, val)} 
             value={ratings[q.id]}
             className={cn("flex flex-wrap gap-4", disabled ? "opacity-60 pointer-events-none" : "")}
             disabled={disabled}
           >
             {['Not Applicable', 'Needs Major Improvement', 'Good', 'Excellent'].map((opt) => (
               <div key={opt} className="flex items-center space-x-2">
                 <RadioGroupItem value={opt} id={`${q.id}-${opt}`} />
                 <label htmlFor={`${q.id}-${opt}`} className="text-sm text-slate-600 cursor-pointer">{opt}</label>
               </div>
             ))}
           </RadioGroup>
        </div>
      </div>
    );
  };

  const tierComparison = getTierComparison(SECTIONS, currentTier);
  const higherTierEntries = Object.entries(tierComparison);
  const visualAccess = getQuestionAccess(questionIndex['logo_upload'], currentTier);
  const visualDisabled = !visualAccess.canSubmit;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Brand Audit Questionnaire</h1>
          <p className="text-slate-500 mt-1">Focus on foundational questions to build your brand core</p>
        </div>
        <Button onClick={handleSave} className="bg-indigo-900 hover:bg-indigo-800">
          <Save className="w-4 h-4 mr-2" /> Save Progress
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="brand_core">Brand Core Story</TabsTrigger>
          <TabsTrigger value="visual">Visual Identity</TabsTrigger>
          <TabsTrigger value="product">Product Experience</TabsTrigger>
          <TabsTrigger value="market">Market Plan</TabsTrigger>
          <TabsTrigger value="tech">Technology & Access</TabsTrigger>
          <TabsTrigger value="brand_activation">Brand Activation</TabsTrigger>
          <TabsTrigger value="team_branding">Team Branding</TabsTrigger>
          <TabsTrigger value="security_trust">Security & Trust</TabsTrigger>
        </TabsList>

        <TabsContent value="brand_core" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <Accordion type="multiple" defaultValue={["core_seed"]} className="space-y-4">
            {SECTIONS.brand_core.map((section) => (
              <AccordionItem key={section.id} value={section.id}>
                <AccordionTrigger>{section.title}</AccordionTrigger>
                <AccordionContent>{section.questions.map((q) => renderQuestion({ ...q, tier: q.tier || section.tier }))}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>

        <TabsContent value="visual" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <Accordion type="multiple" defaultValue={["visual_seed"]} className="space-y-4">
            {SECTIONS.visual.map((section) => (
              <AccordionItem key={section.id} value={section.id}>
                <AccordionTrigger>{section.title}</AccordionTrigger>
                <AccordionContent>{section.questions.map((q) => renderQuestion({ ...q, tier: q.tier || section.tier }))}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Visual Consistency Checker */}
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
                disabled={isAnalyzing || visualDisabled}
                className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 text-lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyzing Visuals...
                  </>
                ) : (
                  visualDisabled ? "Read-only at this tier" : "Analyze My Brand Consistency"
                )}
              </Button>
            )}
          </div>
        </TabsContent>

        <TabsContent value="product" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <Accordion type="multiple" defaultValue={["product_seed"]} className="space-y-4">
            {SECTIONS.product.map((section) => (
              <AccordionItem key={section.id} value={section.id}>
                <AccordionTrigger>{section.title}</AccordionTrigger>
                <AccordionContent>{section.questions.map((q) => renderQuestion({ ...q, tier: q.tier || section.tier }))}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>

        <TabsContent value="market" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <Accordion type="multiple" defaultValue={["market_seed"]} className="space-y-4">
            {SECTIONS.market.map((section) => (
              <AccordionItem key={section.id} value={section.id}>
                <AccordionTrigger>{section.title}</AccordionTrigger>
                <AccordionContent>{section.questions.map((q) => renderQuestion({ ...q, tier: q.tier || section.tier }))}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>

        <TabsContent value="tech" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <Accordion type="multiple" defaultValue={["tech_seed"]} className="space-y-4">
            {SECTIONS.tech.map((section) => (
              <AccordionItem key={section.id} value={section.id}>
                <AccordionTrigger>{section.title}</AccordionTrigger>
                <AccordionContent>{section.questions.map((q) => renderQuestion({ ...q, tier: q.tier || section.tier }))}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>

        <TabsContent value="brand_activation" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <Accordion type="multiple" defaultValue={["activation_seed"]} className="space-y-4">
            {SECTIONS.brand_activation.map((section) => (
              <AccordionItem key={section.id} value={section.id}>
                <AccordionTrigger>{section.title}</AccordionTrigger>
                <AccordionContent>{section.questions.map((q) => renderQuestion({ ...q, tier: q.tier || section.tier }))}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>

        <TabsContent value="team_branding" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <Accordion type="multiple" defaultValue={["team_seed"]} className="space-y-4">
            {SECTIONS.team_branding.map((section) => (
              <AccordionItem key={section.id} value={section.id}>
                <AccordionTrigger>{section.title}</AccordionTrigger>
                <AccordionContent>{section.questions.map((q) => renderQuestion({ ...q, tier: q.tier || section.tier }))}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>

        <TabsContent value="security_trust" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <Accordion type="multiple" defaultValue={["trust_seed"]} className="space-y-4">
            {SECTIONS.security_trust.map((section) => (
              <AccordionItem key={section.id} value={section.id}>
                <AccordionTrigger>{section.title}</AccordionTrigger>
                <AccordionContent>{section.questions.map((q) => renderQuestion({ ...q, tier: q.tier || section.tier }))}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
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

      <div className="mt-8 flex justify-between items-center border-t border-slate-200 pt-6">
        {(() => {
          const currentIndex = TAB_ORDER.indexOf(activeTab);
          const prevTab = TAB_ORDER[currentIndex - 1];
          const nextTab = TAB_ORDER[currentIndex + 1];

          return (
            <>
              <div>
                {prevTab && (
                  <button 
                    onClick={() => setActiveTab(prevTab)}
                    className="text-slate-500 hover:text-indigo-600 font-medium flex items-center transition-colors"
                  >
                    &larr; Previous: {TAB_LABELS[prevTab]}
                  </button>
                )}
              </div>
              
              <div>
                {nextTab ? (
                  <Button onClick={() => setActiveTab(nextTab)} className="bg-slate-900 text-white hover:bg-slate-800">
                    Next: {TAB_LABELS[nextTab]} &rarr;
                  </Button>
                ) : (
                  <Button onClick={() => navigate('/strategy')} className="bg-green-600 hover:bg-green-700">
                    Finish & Generate Strategy &rarr;
                  </Button>
                )}
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
};

export default Questionnaire;
