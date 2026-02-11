import React from 'react';

const POSITIONS = [
  { l: '20%', t: '90%' },
  { l: '35%', t: '85%' },
  { l: '50%', t: '80%' },
  { l: '65%', t: '75%' },
  { l: '65%', t: '60%' },
  { l: '50%', t: '55%' },
  { l: '35%', t: '50%' },
  { l: '20%', t: '45%' },
  { l: '35%', t: '40%' },
  { l: '50%', t: '35%' }
];

const GlassStaircase = () => {
  return (
    <div className="relative w-full h-full perspective-[1200px] overflow-hidden">
      <div
        className="absolute top-0 left-0 w-full h-full transform-style-3d"
        style={{ transform: 'rotateX(55deg) rotateZ(10deg) scale(0.8)' }}
      >
        {POSITIONS.map((pos, index) => (
          <div
            key={`${pos.l}-${pos.t}-${index}`}
            className="absolute bg-red-500 w-32 h-20"
            style={{ left: pos.l, top: pos.t }}
          />
        ))}
      </div>
    </div>
  );
};

export default GlassStaircase;
