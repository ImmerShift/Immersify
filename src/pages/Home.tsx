import { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { useStore as useQuestionnaireStore, setAnswer } from '@/lib/store';
import GlassStaircase from '@/components/Dashboard/GlassStaircase';
import DashboardHUD from '@/components/Dashboard/DashboardHUD';
import { SEED_QUESTIONNAIRE } from '@/data/questionnaires/v3/seed';
import { SPROUT_QUESTIONNAIRE } from '@/data/questionnaires/v3/sprout';
import { STAR_QUESTIONNAIRE } from '@/data/questionnaires/v3/star';
import { SUPERBRAND_QUESTIONNAIRE } from '@/data/questionnaires/v3/superbrand';
import QuestionCard from '@/components/audit/QuestionCard';

type TierKey = 'seed' | 'sprout' | 'star' | 'superbrand';

interface Question {
  id: string;
  type: string;
  text: string;
  helperText?: string;
}

interface ChecklistItem {
  id: string;
  label: string;
  required: boolean;
}

interface Checklist {
  title: string;
  description: string;
  items: ChecklistItem[];
}

interface Section {
  title: string;
  description?: string;
  questions: Question[];
  checklist?: Checklist;
}

interface Pillar {
  pillarId: number;
  pillarTitle: string;
  sections: Section[];
}

interface ResolvedNode {
  id: string;
  title: string;
  tierKey: TierKey;
  active: boolean;
  pillarId: number;
  tierLabel: string;
  sections: Section[];
}

const TIER_DATA: Record<TierKey, Pillar[]> = {
  seed: SEED_QUESTIONNAIRE,
  sprout: SPROUT_QUESTIONNAIRE,
  star: STAR_QUESTIONNAIRE,
  superbrand: SUPERBRAND_QUESTIONNAIRE
};

const TIER_LABELS: Record<TierKey, string> = {
  seed: 'Seed',
  sprout: 'Sprout',
  star: 'Star',
  superbrand: 'Superbrand'
};

const resolveNode = (tierKey: TierKey, pillarId: number, fallbackTitle?: string): ResolvedNode => {
  const pillar = TIER_DATA[tierKey]?.find((item) => item.pillarId === pillarId);
  return {
    id: `${tierKey}-${pillarId}`,
    title: pillar?.pillarTitle || fallbackTitle || 'Section',
    tierKey,
    active: false,
    pillarId,
    tierLabel: TIER_LABELS[tierKey],
    sections: pillar?.sections || []
  };
};

const Home = () => {
  const answersRaw = useQuestionnaireStore((state: any) => state.answers) as Record<string, any> | null;
  const answers = answersRaw || {};
  const currentTier = useQuestionnaireStore(
    (state: any) => state.brandLevel?.level || state.userTier || 'Seed'
  ) ?? 'Seed';
  const defaultActiveNode = useMemo(() => {
    const firstSeed = TIER_DATA.seed?.[0]?.pillarId || 1;
    return resolveNode('seed', firstSeed);
  }, []);
  const [activeNode, setActiveNode] = useState<ResolvedNode | null>(defaultActiveNode);
  const [selectedNode, setSelectedNode] = useState<ResolvedNode | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const openResolvedNode = (node: ResolvedNode) => {
    setSelectedNode(node);
    setDrawerOpen(true);
  };
  const activeNodeForHud = activeNode || defaultActiveNode;
  const handleHudAction = () => {
    if (activeNodeForHud) {
      openResolvedNode(activeNodeForHud);
    }
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-slate-950 flex">
      <div className="relative w-[70%] h-full flex items-center justify-center">
        <GlassStaircase />
      </div>
      <div className="w-[30%] h-full z-50">
        <DashboardHUD activeNode={activeNodeForHud} onOpenNode={handleHudAction} />
      </div>

      <div
        className={`fixed inset-0 bg-black/60 z-[90] transition-opacity ${drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setDrawerOpen(false)}
      />

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-white text-slate-900 shadow-2xl transform transition-transform duration-300 z-[100] ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-200 p-4">
            <div>
              <div className="text-xs uppercase tracking-widest text-slate-500">
                {selectedNode?.tierLabel || currentTier}
              </div>
              <div className="text-lg font-bold">{selectedNode?.title || 'Section'}</div>
            </div>
            <button
              onClick={() => setDrawerOpen(false)}
              className="rounded-full p-2 hover:bg-slate-100 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {selectedNode?.sections?.map((section, index) => (
              <div key={`${selectedNode.id}-${index}`} className="space-y-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-base font-semibold">{section.title}</div>
                  {section.description ? (
                    <div className="text-sm text-slate-500">{section.description}</div>
                  ) : null}
                </div>

                {section.questions.map((question) => (
                  <QuestionCard key={question.id} question={question} userTier={currentTier} />
                ))}

                {section.checklist ? (
                  <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
                    <div>
                      <div className="text-sm font-semibold">{section.checklist.title}</div>
                      <div className="text-xs text-slate-500">{section.checklist.description}</div>
                    </div>
                    <div className="space-y-2">
                      {section.checklist.items.map((item) => {
                        const checked = Boolean(
                          answers?.[selectedNode.tierKey]?.[item.id] ?? answers?.[item.id]
                        );
                        return (
                          <label key={item.id} className="flex items-center gap-2 text-sm text-slate-700">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                              checked={checked}
                              onChange={(e) => setAnswer(item.id, e.target.checked)}
                            />
                            <span>{item.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
