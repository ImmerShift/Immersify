import React, { useMemo } from 'react';
import { AtSign, Camera, Image, Layers, Mic2, Palette, Share2, Type, Globe } from 'lucide-react';
import { calculateBrandHealth } from '@/utils/scoring';
import { useStore as useQuestionnaireStore } from '@/lib/store';
import { SEED_QUESTIONNAIRE } from '@/data/questionnaires/v3/seed';

type HUDNode = {
  title: string;
  tierKey: string;
};

type HUDProps = {
  activeNode?: HUDNode | null;
  onOpenNode?: () => void;
};

const extractSeedAssets = () => {
  const items: Array<{ id: string; label: string }> = [];
  SEED_QUESTIONNAIRE.forEach((pillar) => {
    pillar.sections.forEach((section) => {
      section.checklist?.items?.forEach((item: any) => {
        const label = item.label.toLowerCase();
        if (
          label.includes('logo') ||
          label.includes('website') ||
          label.includes('domain') ||
          label.includes('email') ||
          label.includes('social')
        ) {
          items.push({ id: item.id, label: item.label });
        }
      });
    });
  });
  return items;
};

const DashboardHUD = ({ activeNode, onOpenNode }: HUDProps) => {
  const answersRaw = useQuestionnaireStore((state: any) => state.answers) as Record<string, any> | null;
  const answers = answersRaw || {};
  const gamification = useQuestionnaireStore((state: any) => state.gamification) as {
    current_xp?: number;
    current_streak?: number;
    multiplier_active?: number;
  } | null;
  const currentXp = gamification?.current_xp ?? 0;
  const { globalScore } = useMemo(() => calculateBrandHealth(answers), [answers]);
  const seedAssets = useMemo(() => extractSeedAssets(), []);

  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const progress = (globalScore / 100) * circumference;

  const getAssetValue = (id?: string) => {
    if (!id) return false;
    if (answers?.seed && typeof answers.seed === 'object' && id in answers.seed) {
      return answers.seed[id];
    }
    return answers?.[id];
  };

  const findAssetId = (keywords: string[]) =>
    seedAssets.find((item) =>
      keywords.some((keyword) => item.label.toLowerCase().includes(keyword))
    )?.id;

  const assets = [
    { label: 'Logo', icon: Image, id: findAssetId(['logo']) },
    { label: 'Palette', icon: Palette, id: findAssetId(['palette', 'color']) },
    { label: 'Fonts', icon: Type, id: findAssetId(['font', 'type']) },
    { label: 'Voice', icon: Mic2, id: findAssetId(['voice', 'tone']) },
    { label: 'Website', icon: Globe, id: findAssetId(['website', 'domain']) },
    { label: 'Social', icon: Share2, id: findAssetId(['social']) },
    { label: 'Email', icon: AtSign, id: findAssetId(['email']) },
    { label: 'Photography', icon: Camera, id: findAssetId(['photo', 'image']) },
    { label: 'Guidelines', icon: Layers, id: findAssetId(['guideline', 'brand']) }
  ];

  return (
    <div className="w-full h-full bg-slate-900/50 backdrop-blur-xl border-l border-white/10 p-6 space-y-6">
      <div className="space-y-3">
        <div className="text-xs uppercase tracking-[0.3em] text-slate-400">Brand Score</div>
        <div className="relative w-40 h-40 mx-auto">
          <svg viewBox="0 0 120 120" className="w-full h-full">
            <defs>
              <linearGradient id="hudGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22D3EE" />
                <stop offset="50%" stopColor="#818CF8" />
                <stop offset="100%" stopColor="#F472B6" />
              </linearGradient>
            </defs>
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="10"
              fill="none"
            />
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke="url(#hudGradient)"
              strokeWidth="10"
              strokeDasharray={`${progress} ${circumference}`}
              strokeLinecap="round"
              fill="none"
              transform="rotate(-90 60 60)"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-4xl font-bold text-cyan-200 drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]">
              {globalScore}%
            </div>
          </div>
        </div>
        <div className="text-center text-xs text-slate-400">Overall Completion</div>
        <div className="text-center text-xs text-slate-400 mt-2">XP: {currentXp}</div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3 shadow-lg">
        <div className="text-xs uppercase tracking-[0.3em] text-slate-400">Immediate Directive</div>
        <div className="text-base font-semibold text-white min-h-[2.5rem]">
          {activeNode ? activeNode.title : 'Awaiting Orders'}
        </div>
        <button
          onClick={onOpenNode}
          className="w-full relative overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-4 py-3 text-sm font-bold tracking-widest text-white shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:scale-[1.02] transition"
        >
          <span className="absolute inset-0 animate-pulse bg-white/10" />
          <span className="relative z-10">{activeNode ? 'CONTINUE' : 'INITIATE'}</span>
        </button>
      </div>

      <div className="space-y-3">
        <div className="text-xs uppercase tracking-[0.3em] text-slate-400">Brand Assets</div>
        <div className="grid grid-cols-3 gap-3">
          {assets.map((asset) => {
            const Icon = asset.icon;
            const acquired = Boolean(getAssetValue(asset.id));
            return (
              <div
                key={asset.label}
                className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-3 text-[10px] uppercase tracking-wide transition ${
                  acquired
                    ? 'border-cyan-400/60 shadow-[0_0_16px_rgba(34,211,238,0.5)] text-cyan-100'
                    : 'border-white/10 text-white/40 grayscale'
                }`}
              >
                <Icon size={18} className={acquired ? 'text-cyan-200' : 'text-white/30'} />
                <span className="text-center">{asset.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardHUD;
