'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';

// Tiny deterministic PRNG (mulberry32). Seeding it means the server and client
// generate the *same* "random" layout, so decorative SVGs don't trigger
// hydration mismatches.
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ============================================
// 1. FILM REEL — rotating cinema reel
// ============================================
export function FilmReel({
  size = 300,
  color = 'currentColor',
  speed = 60,
  reverse = false,
  className = '',
}: {
  size?: number;
  color?: string;
  speed?: number;
  reverse?: boolean;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      style={{ animation: `spin ${speed}s linear ${reverse ? 'reverse' : ''} infinite` }}
    >
      <circle cx="100" cy="100" r="95" stroke={color} strokeWidth="1.5" fill="none" opacity="0.6" />
      <circle cx="100" cy="100" r="70" stroke={color} strokeWidth="1.5" fill="none" opacity="0.5" />
      <circle cx="100" cy="100" r="45" stroke={color} strokeWidth="1.5" fill="none" opacity="0.4" />
      <circle cx="100" cy="100" r="12" fill={color} opacity="0.8" />
      {[...Array(8)].map((_, i) => (
        <circle
          key={i}
          cx={100 + Math.cos((i * Math.PI) / 4) * 55}
          cy={100 + Math.sin((i * Math.PI) / 4) * 55}
          r="9"
          fill={color}
          opacity="0.7"
        />
      ))}
      {[...Array(16)].map((_, i) => (
        <circle
          key={i}
          cx={100 + Math.cos((i * Math.PI) / 8) * 82}
          cy={100 + Math.sin((i * Math.PI) / 8) * 82}
          r="2"
          fill={color}
          opacity="0.5"
        />
      ))}
    </svg>
  );
}

// ============================================
// 2. PROJECTOR BEAM — animated light cone
// ============================================
export function ProjectorBeam({
  color = 'currentColor',
  className = '',
}: { color?: string; className?: string }) {
  return (
    <svg viewBox="0 0 400 400" className={className} preserveAspectRatio="none">
      <defs>
        <linearGradient id="beam-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.5" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.polygon
        points="0,0 30,0 200,400 -50,400"
        fill="url(#beam-grad)"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </svg>
  );
}

// ============================================
// 3. SOUND WAVE — animated audio bars
// ============================================
export function SoundWave({
  color = 'currentColor',
  bars = 40,
  className = '',
}: { color?: string; bars?: number; className?: string }) {
  return (
    <svg viewBox="0 0 800 200" className={className} preserveAspectRatio="none">
      {[...Array(bars)].map((_, i) => {
        const x = (i / bars) * 800;
        // Clamp to a positive minimum — SVG <rect height> must be >= 0, and the
        // raw sine/cosine sum can otherwise dip negative.
        const baseH = Math.max(
          6,
          40 + Math.sin(i * 0.3) * 50 + Math.cos(i * 0.5) * 30,
        );
        return (
          <rect
            key={i}
            x={x}
            y={100 - baseH / 2}
            width={800 / bars - 4}
            height={baseH}
            rx="3"
            fill={color}
          >
            <animate
              attributeName="height"
              values={`${baseH};${baseH * 1.6};${baseH * 0.5};${baseH * 1.3};${baseH}`}
              dur={`${2 + (i % 4) * 0.4}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="y"
              values={`${100 - baseH / 2};${100 - (baseH * 1.6) / 2};${100 - (baseH * 0.5) / 2};${100 - (baseH * 1.3) / 2};${100 - baseH / 2}`}
              dur={`${2 + (i % 4) * 0.4}s`}
              repeatCount="indefinite"
            />
          </rect>
        );
      })}
    </svg>
  );
}

// ============================================
// 4. FILM STRIP — horizontal perforated strip
// ============================================
export function FilmStrip({
  color = 'currentColor',
  className = '',
}: { color?: string; className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="shrink-0 w-12 h-7 rounded-sm border-2"
          style={{ borderColor: color, opacity: 0.6 }}
        />
      ))}
    </div>
  );
}

// ============================================
// 5. CURTAIN FOLDS — theatre curtain pattern
// ============================================
export function CurtainFolds({
  color = 'currentColor',
  className = '',
}: { color?: string; className?: string }) {
  return (
    <svg viewBox="0 0 1200 100" className={className} preserveAspectRatio="none">
      <defs>
        <pattern id="curtain-pat" patternUnits="userSpaceOnUse" width="80" height="100">
          <path d="M0,0 Q40,40 0,80 T0,100" stroke={color} strokeWidth="2" fill="none" opacity="0.6" />
          <path d="M40,0 Q80,40 40,80 T40,100" stroke={color} strokeWidth="2" fill="none" opacity="0.4" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#curtain-pat)" />
    </svg>
  );
}

// ============================================
// 6. SEAT GRID — theatre seating pattern
// ============================================
export function SeatGrid({
  color = 'currentColor',
  className = '',
}: { color?: string; className?: string }) {
  return (
    <svg viewBox="0 0 1200 800" className={className} preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="seat-pat" patternUnits="userSpaceOnUse" width="80" height="60">
          <rect x="10" y="15" width="60" height="30" rx="6" fill="none" stroke={color} strokeWidth="2" opacity="0.5" />
          <rect x="15" y="20" width="50" height="20" rx="4" fill={color} opacity="0.25" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#seat-pat)" />
    </svg>
  );
}

// ============================================
// 7. FLOWING CURVES — animated organic waves
// ============================================
export function FlowingCurves({
  color = 'currentColor',
  className = '',
}: { color?: string; className?: string }) {
  return (
    <svg viewBox="0 0 1200 600" className={className} preserveAspectRatio="none">
      <motion.path
        d="M-50,200 Q200,80 400,200 T800,200 T1250,200"
        stroke={color}
        strokeWidth="2"
        fill="none"
        opacity="0.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
      />
      <motion.path
        d="M-50,300 Q300,180 500,300 T900,300 T1250,300"
        stroke={color}
        strokeWidth="2"
        fill="none"
        opacity="0.4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: 0.5 }}
      />
      <motion.path
        d="M-50,400 Q150,280 350,400 T750,400 T1250,400"
        stroke={color}
        strokeWidth="2"
        fill="none"
        opacity="0.3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 6, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: 1 }}
      />
    </svg>
  );
}

// ============================================
// 8. STARFIELD — dots pattern
// ============================================
export function Starfield({
  color = 'currentColor',
  count = 80,
  className = '',
}: { color?: string; count?: number; className?: string }) {
  // Seed the PRNG with `count` so the field is identical on server and client.
  const stars = useMemo(() => {
    const rand = mulberry32((count + 1) * 2654435761);
    return Array.from({ length: count }, () => ({
      x: rand() * 1000,
      y: rand() * 1000,
      r: rand() * 1.5 + 0.5,
      dur: 2 + rand() * 3,
      begin: rand() * 3,
    }));
  }, [count]);

  return (
    <svg viewBox="0 0 1000 1000" className={className} preserveAspectRatio="xMidYMid slice">
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={color}>
          <animate
            attributeName="opacity"
            values="0.2;1;0.2"
            dur={`${s.dur}s`}
            repeatCount="indefinite"
            begin={`${s.begin}s`}
          />
        </circle>
      ))}
    </svg>
  );
}

// ============================================
// 9. CONCENTRIC RINGS — radiating circles
// ============================================
export function ConcentricRings({
  color = 'currentColor',
  className = '',
}: { color?: string; className?: string }) {
  return (
    <svg viewBox="0 0 400 400" className={className}>
      {[...Array(8)].map((_, i) => (
        <motion.circle
          key={i}
          cx="200"
          cy="200"
          r={30 + i * 20}
          fill="none"
          stroke={color}
          strokeWidth="1"
          opacity={0.4 - i * 0.04}
          animate={{
            r: [30 + i * 20, 35 + i * 20, 30 + i * 20],
            opacity: [0.4 - i * 0.04, 0.6 - i * 0.04, 0.4 - i * 0.04],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </svg>
  );
}

// ============================================
// 10. SPOTLIGHT BEAMS — dual cone spotlights
// ============================================
export function SpotlightBeams({
  color1 = '#FF5A38',
  color2 = '#7E54E9',
  className = '',
}: { color1?: string; color2?: string; className?: string }) {
  return (
    <div className={className}>
      <motion.div
        animate={{ rotate: [8, -8, 8] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-32 left-1/4 w-2 h-[800px] origin-top"
        style={{
          background: `linear-gradient(to bottom, ${color1}50, transparent)`,
          filter: 'blur(40px)',
        }}
      />
      <motion.div
        animate={{ rotate: [-8, 8, -8] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-32 right-1/4 w-2 h-[800px] origin-top"
        style={{
          background: `linear-gradient(to bottom, ${color2}50, transparent)`,
          filter: 'blur(40px)',
        }}
      />
    </div>
  );
}

// ============================================
// 11. SCREEN FRAMES — nested rectangles
// ============================================
export function ScreenFrames({
  color = 'currentColor',
  className = '',
}: { color?: string; className?: string }) {
  return (
    <div className={className}>
      {[1, 2, 3, 4, 5].map((n) => (
        <motion.div
          key={n}
          className="absolute border rounded-3xl"
          style={{
            inset: `${n * 4}%`,
            borderColor: color,
            opacity: 0.15 - n * 0.02,
          }}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{
            duration: 4 + n,
            repeat: Infinity,
            delay: n * 0.3,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// ============================================
// 12. CINEMA TICKETS — flying ticket motif
// ============================================
export function TicketsFloating({
  color = 'currentColor',
  className = '',
}: { color?: string; className?: string }) {
  return (
    <div className={`${className} relative`}>
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute border-2 rounded-lg"
          style={{
            width: '80px',
            height: '40px',
            borderColor: color,
            left: `${10 + i * 18}%`,
            top: `${20 + (i % 3) * 30}%`,
            opacity: 0.2,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [i * 10 - 15, i * 10 + 5, i * 10 - 15],
          }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            delay: i * 0.5,
            ease: 'easeInOut',
          }}
        >
          <div className="absolute inset-y-0 left-1/2 w-px border-l-2 border-dashed" style={{ borderColor: color }} />
        </motion.div>
      ))}
    </div>
  );
}
