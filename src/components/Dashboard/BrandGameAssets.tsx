import React from 'react';
import { motion } from 'framer-motion';

export const Astronaut = ({ isWalking = false, isIdle = true }) => {
  return (
    <motion.svg
      width="80"
      height="80"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      animate={isWalking ? "walking" : isIdle ? "idle" : "static"}
      variants={{
        idle: { y: [0, -8, 0], rotate: [0, 1, -1, 0], transition: { repeat: Infinity, duration: 4, ease: "easeInOut" } },
        walking: { y: [0, -5, 0], rotate: [0, 3, -3, 0], transition: { repeat: Infinity, duration: 0.5 } },
        static: { y: 0 }
      }}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <radialGradient id="suitGradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(50 50) rotate(90) scale(50)">
          <stop stopColor="white" />
          <stop offset="1" stopColor="#CBD5E1" />
        </radialGradient>
        <radialGradient id="visorGradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(50 45) rotate(90) scale(20)">
          <stop stopColor="#38BDF8" />
          <stop offset="0.8" stopColor="#0F172A" />
        </radialGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
             <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.3"/>
        </filter>
      </defs>

      {/* Shadow Blob */}
      <ellipse cx="50" cy="90" rx="20" ry="5" fill="black" fillOpacity="0.2" filter="blur(4px)" />

      {/* Backpack (Tank) */}
      <rect x="20" y="30" width="60" height="50" rx="12" fill="#94A3B8" stroke="#475569" strokeWidth="1" filter="url(#shadow)" />
      
      {/* Right Arm (Behind) */}
      <motion.path 
        d="M70 50 C75 50, 85 60, 85 70" 
        stroke="url(#suitGradient)" 
        strokeWidth="10" 
        strokeLinecap="round"
        animate={isWalking ? { d: "M70 50 C75 50, 85 55, 85 60" } : {}}
      />

      {/* Right Leg (Behind) */}
      <motion.path 
        d="M60 80 L65 95" 
        stroke="url(#suitGradient)" 
        strokeWidth="12" 
        strokeLinecap="round"
        animate={isWalking ? { d: ["M60 80 L65 95", "M60 80 L70 85", "M60 80 L65 95"] } : {}}
      />

      {/* Main Body */}
      <rect x="30" y="40" width="40" height="45" rx="15" fill="url(#suitGradient)" filter="url(#shadow)" />

      {/* Left Leg */}
      <motion.path 
        d="M40 80 L35 95" 
        stroke="url(#suitGradient)" 
        strokeWidth="12" 
        strokeLinecap="round"
        animate={isWalking ? { d: ["M40 80 L35 95", "M40 80 L30 85", "M40 80 L35 95"] } : {}}
      />

      {/* Left Arm */}
      <motion.path 
        d="M30 50 C25 50, 15 60, 15 70" 
        stroke="url(#suitGradient)" 
        strokeWidth="10" 
        strokeLinecap="round"
        animate={isWalking ? { d: "M30 50 C25 50, 15 55, 15 60" } : {}}
      />

      {/* Helmet Base */}
      <circle cx="50" cy="40" r="22" fill="url(#suitGradient)" filter="url(#shadow)" />
      
      {/* Visor */}
      <circle cx="50" cy="40" r="16" fill="url(#visorGradient)" />
      
      {/* Visor Reflection (Gloss) */}
      <path d="M42 34 Q50 30 58 34" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      <ellipse cx="45" cy="38" rx="3" ry="5" fill="white" opacity="0.4" transform="rotate(-15 45 38)" />

      {/* Details */}
      <rect x="42" y="60" width="16" height="12" rx="2" fill="#334155" />
      <circle cx="46" cy="66" r="2" fill="#EF4444" />
      <circle cx="54" cy="66" r="2" fill="#22C55E" />

      {/* Flag / Antenna */}
      <motion.line 
        x1="70" y1="35" x2="70" y2="10" 
        stroke="#64748B" 
        strokeWidth="2" 
        animate={{ scaleY: [1, 1.05, 1] }} 
      />
      <circle cx="70" cy="10" r="3" fill="#F59E0B" filter="url(#glow)" />

    </motion.svg>
  );
};

export const BaseCampSeed = () => (
  <svg width="80" height="80" viewBox="0 0 100 100" fill="none" style={{ overflow: 'visible' }}>
    <defs>
      <filter id="domeGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <path d="M20 80 A30 30 0 0 1 80 80" fill="rgba(16, 185, 129, 0.2)" stroke="#10B981" strokeWidth="2" />
    <ellipse cx="50" cy="80" rx="30" ry="5" fill="#064E3B" />
    <path d="M50 80 L50 50 M50 50 L40 40 M50 50 L60 40" stroke="#34D399" strokeWidth="4" strokeLinecap="round" />
    <circle cx="40" cy="40" r="4" fill="#F472B6" />
    <circle cx="60" cy="40" r="4" fill="#F472B6" />
  </svg>
);

export const BaseCampSprout = () => (
  <svg width="80" height="80" viewBox="0 0 100 100" fill="none" style={{ overflow: 'visible' }}>
    <rect x="25" y="75" width="50" height="10" fill="#334155" rx="2" />
    <path d="M35 75 L35 30 L40 20 L60 20 L65 30 L65 75" fill="rgba(56, 189, 248, 0.1)" stroke="#38BDF8" strokeWidth="2" />
    <path d="M45 65 L45 45 L50 40 L55 45 L55 65" fill="#E2E8F0" filter="drop-shadow(0 0 5px rgba(56, 189, 248, 0.5))" />
    <path d="M50 65 L50 75" stroke="#F59E0B" strokeWidth="3" />
  </svg>
);

export const BaseCampStar = () => (
  <svg width="80" height="80" viewBox="0 0 100 100" fill="none" style={{ overflow: 'visible' }}>
    <circle cx="50" cy="50" r="35" stroke="#6366F1" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
    <circle cx="50" cy="50" r="15" fill="#312E81" stroke="#818CF8" strokeWidth="2" />
    <path d="M20 50 L35 50" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" />
    <path d="M65 50 L80 50" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" />
    <circle cx="50" cy="50" r="5" fill="#F472B6" filter="blur(2px)" />
  </svg>
);

export const Cloud = ({ delay = 0, scale = 1, opacity = 0.5, size = 100, fill = "white" }) => (
  <motion.div
    initial={{ x: -100 }}
    animate={{ x: 800 }} 
    transition={{ duration: 30 + Math.random() * 20, repeat: Infinity, delay, ease: "linear" }}
    style={{ opacity, scale, width: size, height: size * 0.6 }}
  >
    <svg viewBox="0 0 100 60" fill={fill} style={{ width: '100%', height: '100%' }}>
      <path d="M10 40 Q20 20 40 30 Q50 10 70 30 Q90 20 90 40 Q100 50 90 60 L10 60 Q0 50 10 40" filter="blur(2px)" />
    </svg>
  </motion.div>
);

export const Star = ({ delay = 0 }) => (
  <motion.div
    animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.5, 0.8] }}
    transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay }}
  >
    <svg width="12" height="12" viewBox="0 0 10 10" fill="white">
      <path d="M5 0 L6 4 L10 5 L6 6 L5 10 L4 6 L0 5 L4 4 Z" filter="blur(0.5px)" />
    </svg>
  </motion.div>
);

// --- Platforms for Stacked Layout ---

export const PlatformSoil = ({ width = 160 }) => (
  <svg width={width} height="60" viewBox="0 0 160 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 20 C30 5, 130 5, 150 20 L160 60 L0 60 Z" fill="#3F2E23" />
    <path d="M10 20 C30 5, 130 5, 150 20 L150 25 C130 10, 30 10, 10 25 Z" fill="#10B981" /> {/* Grass Top */}
    <circle cx="30" cy="40" r="3" fill="#5D4037" />
    <circle cx="120" cy="45" r="4" fill="#5D4037" />
    <path d="M40 35 L45 50 L35 50 Z" fill="#5D4037" opacity="0.5" />
  </svg>
);

export const PlatformBranch = ({ width = 160 }) => (
  <svg width={width} height="60" viewBox="0 0 160 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 30 C40 25, 120 25, 160 30 C150 50, 10 50, 0 30 Z" fill="#5D4037" />
    <path d="M0 30 C40 25, 120 25, 160 30" stroke="#3E2723" strokeWidth="2" />
    <ellipse cx="80" cy="30" rx="60" ry="5" fill="#22C55E" opacity="0.3" /> {/* Moss */}
    <path d="M20 30 L20 40 M140 30 L140 35" stroke="#5D4037" strokeWidth="2" />
    <circle cx="20" cy="30" r="3" fill="#22C55E" /> {/* Leaf */}
    <circle cx="140" cy="30" r="3" fill="#22C55E" /> {/* Leaf */}
  </svg>
);

export const PlatformCloud = ({ width = 160 }) => (
  <svg width={width} height="60" viewBox="0 0 160 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 30 Q30 10 50 20 Q70 0 100 20 Q130 10 140 30 Q160 40 140 50 Q100 60 20 50 Q0 40 20 30" fill="white" fillOpacity="0.8" filter="blur(1px)" />
    <path d="M30 35 Q40 20 60 30" stroke="#E0F2FE" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const PlatformMeteor = ({ width = 160 }) => (
  <svg width={width} height="60" viewBox="0 0 160 60" fill="none" xmlns="http://www.w3.org/2000/svg">
     <path d="M10 25 C30 15, 130 15, 150 25 L140 50 C120 55, 40 55, 20 50 Z" fill="#475569" />
     <path d="M10 25 C30 15, 130 15, 150 25" stroke="#94A3B8" strokeWidth="2" />
     <circle cx="40" cy="35" r="5" fill="#1E293B" opacity="0.5" /> {/* Crater */}
     <circle cx="100" cy="40" r="8" fill="#1E293B" opacity="0.5" /> {/* Crater */}
     <path d="M130 30 L150 10" stroke="#F59E0B" strokeWidth="2" strokeDasharray="4 4" opacity="0.5" /> {/* Trail */}
  </svg>
);

export const BaseCampSuperbrand = () => (
    <svg width="80" height="80" viewBox="0 0 100 100" fill="none" style={{ overflow: 'visible' }}>
        {/* Planet Body */}
        <circle cx="50" cy="50" r="25" fill="#D97706" />
        <circle cx="50" cy="50" r="25" fill="url(#planetGrad)" opacity="0.8" />
        
        {/* Rings */}
        <ellipse cx="50" cy="50" rx="40" ry="10" stroke="#FDE68A" strokeWidth="4" transform="rotate(-20 50 50)" fill="none" opacity="0.8" />
        <ellipse cx="50" cy="50" rx="45" ry="12" stroke="#78350F" strokeWidth="1" transform="rotate(-20 50 50)" fill="none" opacity="0.5" />

        <defs>
            <radialGradient id="planetGrad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(30 30) rotate(90) scale(50)">
                <stop stopColor="#FCD34D" />
                <stop offset="1" stopColor="#78350F" />
            </radialGradient>
        </defs>
    </svg>
);
