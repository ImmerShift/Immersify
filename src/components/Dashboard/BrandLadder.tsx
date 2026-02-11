import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Palette, Rocket, Shield, Users, Megaphone, Monitor, BarChart, Lock } from 'lucide-react';
import { SEED_QUESTIONNAIRE } from '@/data/questionnaires/v3/seed';
import { SPROUT_QUESTIONNAIRE } from '@/data/questionnaires/v3/sprout';
import { STAR_QUESTIONNAIRE } from '@/data/questionnaires/v3/star';
import { SUPERBRAND_QUESTIONNAIRE } from '@/data/questionnaires/v3/superbrand';
import { useStore as useQuestionnaireStore } from '@/lib/store';
import { Astronaut } from '@/components/Dashboard/BrandGameAssets';

// --- TYPES ---
export type LadderNode = {
  id: string;
  title: string;
  tierKey: string;
  active: boolean;
};

// --- HELPERS ---
const getPillarIcon = (pillarId: number) => {
  switch (pillarId) {
    case 1: return Brain;
    case 2: return Palette;
    case 3: return Rocket;
    case 4: return BarChart;
    case 5: return Monitor;
    case 6: return Megaphone;
    case 7: return Users;
    case 8: return Shield;
    default: return Brain;
  }
};

const ParticleBackground = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {[...Array(20)].map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 bg-white rounded-full opacity-50"
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animation: `pulse ${2 + Math.random() * 3}s infinite ease-in-out ${Math.random() * 2}s`
        }}
      />
    ))}
    <style>{`
      @keyframes pulse {
        0%, 100% { opacity: 0.2; transform: scale(0.8); }
        50% { opacity: 0.8; transform: scale(1.2); }
      }
    `}</style>
  </div>
);

const BrandLadder = ({
  onNodeSelect,
  onActiveNodeChange
}: {
  onNodeSelect?: (node: LadderNode) => void;
  onActiveNodeChange?: (node: LadderNode) => void;
}) => {

  // --- STEP 1: PREPARE THE DATA ---
  const allNodes = useMemo(() => [
    ...SEED_QUESTIONNAIRE.map(p => ({ ...p, tier: 'seed' })),
    ...SPROUT_QUESTIONNAIRE.map(p => ({ ...p, tier: 'sprout' })),
    ...STAR_QUESTIONNAIRE.map(p => ({ ...p, tier: 'star' })),
    ...SUPERBRAND_QUESTIONNAIRE.map(p => ({ ...p, tier: 'superbrand' }))
  ], []);
  const answersRaw = useQuestionnaireStore((state: any) => state.answers) as Record<string, any> | null;
  const answers = answersRaw || {};

  // --- STEP 2: THE COORDINATE MAP ---
  const coordinates = [
    // SEED
    { top: '92%', left: '50%' },
    { top: '88%', left: '65%' },
    { top: '84%', left: '80%' },
    { top: '80%', left: '65%' },
    { top: '76%', left: '35%' },
    { top: '72%', left: '20%' },
    // SPROUT
    { top: '68%', left: '35%' },
    { top: '64%', left: '65%' },
    { top: '60%', left: '80%' },
    { top: '56%', left: '65%' },
    { top: '52%', left: '35%' },
    { top: '48%', left: '20%' },
    // STAR
    { top: '44%', left: '35%' },
    { top: '40%', left: '65%' },
    { top: '36%', left: '80%' },
    { top: '32%', left: '65%' },
    { top: '28%', left: '35%' },
    { top: '24%', left: '20%' },
    // SUPERBRAND
    { top: '20%', left: '35%' },
    { top: '16%', left: '65%' },
    { top: '12%', left: '80%' },
    { top: '8%',  left: '65%' },
    { top: '4%',  left: '50%' },
  ];

  const getTierStyles = (tier: string, isActive: boolean) => {
    if (isActive) return 'border-white shadow-[0_0_20px_rgba(255,255,255,0.5)] bg-white/20 scale-110 z-10';
    
    switch (tier) {
      case 'seed': return 'border-emerald-500 shadow-emerald-500/20';
      case 'sprout': return 'border-cyan-500 shadow-cyan-500/20';
      case 'star': return 'border-purple-500 shadow-purple-500/20';
      case 'superbrand': return 'border-amber-400 shadow-amber-400/20';
      default: return 'border-white/20 shadow-white/10';
    }
  };

  const pathData = `
    M 300 800
    C 450 800, 550 750, 550 680
    C 550 580, 50 580, 50 480
    C 50 380, 550 380, 550 280
    C 550 180, 300 150, 300 50
  `;

  const getAnswerValue = (tierKey: string, id: string) => {
    if (answers?.[tierKey] && typeof answers[tierKey] === 'object' && id in answers[tierKey]) {
      return answers[tierKey][id];
    }
    return answers?.[id];
  };

  const nodeCompletion = useMemo(() => {
    return allNodes.map((node) => {
      const questions = node.sections?.flatMap((section: any) => section.questions || []) || [];
      const checklistItems = node.sections?.flatMap((section: any) => section.checklist?.items || []) || [];
      const total = questions.length + checklistItems.length;
      if (!total) {
        return { completed: false };
      }
      const answeredQuestions = questions.filter((question: any) => {
        const value = getAnswerValue(node.tier, question.id);
        return typeof value === 'string' && value.trim().length > 10;
      }).length;
      const answeredChecklist = checklistItems.filter((item: any) => Boolean(getAnswerValue(node.tier, item.id))).length;
      return { completed: answeredQuestions + answeredChecklist >= total };
    });
  }, [allNodes, answers]);

  const activeIndex = useMemo(() => {
    const firstIncomplete = nodeCompletion.findIndex((item) => !item.completed);
    return firstIncomplete >= 0 ? firstIncomplete : 0;
  }, [nodeCompletion]);

  useEffect(() => {
    if (!onActiveNodeChange) return;
    const activeNode = allNodes[activeIndex];
    if (!activeNode) return;
    onActiveNodeChange({
      id: `${activeNode.tier}-${activeNode.pillarId}`,
      title: activeNode.pillarTitle,
      tierKey: activeNode.tier,
      active: true
    });
  }, [activeIndex, allNodes, onActiveNodeChange]);

  const pathRef = useRef<SVGPathElement | null>(null);
  const [autoCoords, setAutoCoords] = useState<Array<{ top: string; left: string }>>([]);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const total = path.getTotalLength();
    const count = allNodes.length;
    const margin = 20; // avoid extreme ends
    const usable = Math.max(total - margin * 2, 1);
    const positions: Array<{ top: string; left: string }> = [];
    for (let i = 0; i < count; i++) {
      const t = i / Math.max(count - 1, 1);
      const eased = t * t * (3 - 2 * t);
      const len = margin + usable * eased;
      const pt = path.getPointAtLength(len);
      const leftPct = `${(pt.x / 600) * 100}%`;
      const topPct = `${(pt.y / 800) * 100}%`;
      positions.push({ top: topPct, left: leftPct });
    }
    setAutoCoords(positions);
  }, [allNodes.length]);

  const activePos =
    (autoCoords[activeIndex] as { top: string; left: string }) ||
    coordinates[activeIndex] ||
    { top: '92%', left: '50%' };

  return (
    <div className="flex justify-center items-center w-full py-10">
      <div 
        className="relative w-full max-w-[600px] h-[800px] bg-gradient-to-b from-slate-900 via-indigo-950 to-emerald-950 rounded-3xl border border-white/10 shadow-2xl overflow-hidden perspective-[1000px]"
      >
        {/* --- MODULE 3: ATMOSPHERE --- */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none"></div>
        <ParticleBackground />

        {/* --- MODULE 1: SVG PATH --- */}
        <svg 
          className="absolute inset-0 w-full h-full" 
          viewBox="0 0 600 800" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="road-gradient" x1="0%" y1="100%" x2="0%" y2="0%">
               <stop offset="0%" stopColor="white" stopOpacity="0.05" />
               <stop offset="100%" stopColor="white" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          <path d={pathData} stroke="url(#road-gradient)" strokeWidth="40" strokeLinecap="round" fill="none" className="opacity-80" />
          <path d={pathData} stroke="white" strokeWidth="42" strokeOpacity="0.1" strokeLinecap="round" fill="none" />
          <path d={pathData} stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path ref={pathRef} d={pathData} stroke="#22D3EE" strokeWidth="2.5" strokeOpacity="0.25" strokeLinecap="round" fill="none" filter="url(#glow-cyan)" />
        </svg>

        {/* --- MODULE 2: GLASS ISLANDS --- */}
        <div className="absolute inset-0 pointer-events-none">
          {allNodes.map((node, index) => {
            const pos =
              autoCoords[index] ||
              coordinates[index] ||
              { top: '50%', left: '50%' };
            const Icon = getPillarIcon(node.pillarId);
            const isActive = index === activeIndex;
            const tierStyle = getTierStyles(node.tier, isActive);

            return (
              <div
                key={`${node.tier}-${node.pillarId}`}
                className={`group absolute w-24 h-16 p-2 flex flex-col items-center justify-center 
                  backdrop-blur-sm border rounded-xl transition-all duration-300
                  ${tierStyle}
                  ${isActive ? 'bg-white/25 scale-105' : 'bg-white/5'}
                `}
                style={{
                  top: pos.top,
                  left: pos.left,
                  transform: 'translate(-50%, -50%) rotateX(10deg)', 
                  pointerEvents: 'auto',
                  cursor: 'pointer'
                }}
                onClick={() => onNodeSelect?.({ 
                  id: `${node.tier}-${node.pillarId}`, 
                  title: node.pillarTitle, 
                  tierKey: node.tier, 
                  active: isActive 
                })}
              >
                {/* Active Ring Animation */}
                {isActive && (
                   <span className="absolute -inset-1 rounded-xl border-2 border-white/50 animate-ping opacity-75 pointer-events-none"></span>
                )}

                <div className="p-2 rounded-md bg-white/20 text-white shadow-inner relative z-10">
                  <Icon size={16} />
                </div>

                {/* Title hidden until hover */}
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-1 rounded-md bg-slate-900/90 border border-white/30 text-[10px] font-bold text-white text-center leading-tight uppercase tracking-wide opacity-0 group-hover:opacity-100 transition shadow-[0_0_12px_rgba(255,255,255,0.15)]">
                  {node.pillarTitle}
                </div>

                {!isActive && (
                  <div className="absolute -top-2 -right-2 bg-slate-900 rounded-full p-1 border border-white/20 z-10">
                    <Lock size={10} className="text-slate-500" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* --- MODULE 3: THE ASTRONAUT (HERO) --- */}
        <motion.div
          className="absolute w-24 h-24 z-50 pointer-events-none"
          initial={false}
          animate={{
            top: activePos.top,
            left: activePos.left,
            marginTop: '-60px',
            marginLeft: '10px'
          }}
          transition={{
            type: "spring",
            stiffness: 50,
            damping: 14,
            mass: 1.1
          }}
          style={{ transform: 'translateX(-50%)' }}
        >
          <motion.div
            className="w-24 h-24 drop-shadow-2xl"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            <Astronaut isWalking={false} isIdle />
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
};

export default BrandLadder;
