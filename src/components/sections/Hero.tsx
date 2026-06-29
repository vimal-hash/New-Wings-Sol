'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Play, Monitor, Volume2, Armchair, Projector, Sparkles, Cpu, Zap, Palette } from 'lucide-react';

// ============================================
// SERVICE MINI-CARDS — show all we do in tiles
// ============================================

function ScreenTile() {
  return (
    <div className="relative h-full w-full bg-gradient-to-br from-navy-700 to-navy-900 rounded-2xl overflow-hidden flex items-center justify-center p-6">
      {/* Screen depicting cinema */}
      <div className="relative w-full aspect-[16/9] bg-gradient-to-br from-cobalt-500 via-lavender-500 to-coral-500 rounded-md overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <Monitor className="w-4 h-4 text-white/80" />
        <span className="text-[10px] tracking-widest text-white/80 font-mono">CINEMA SCREEN</span>
      </div>
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
        <div className="text-white font-display text-lg leading-tight">Galalite<br/>PRISM 3D</div>
        <div className="text-[10px] text-white/60 font-mono">4K · HDR</div>
      </div>
    </div>
  );
}

function ProjectorTile() {
  return (
    <div className="relative h-full w-full bg-gradient-to-br from-crimson-500 to-crimson-700 rounded-2xl overflow-hidden p-5">
      <div className="absolute top-3 left-3 flex items-center gap-2">
        <Projector className="w-4 h-4 text-white/80" />
        <span className="text-[10px] tracking-widest text-white/80 font-mono">PROJECTION</span>
      </div>
      {/* Projector body */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-12 bg-ink-900 rounded-lg flex items-center justify-center">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-mustard-300 to-mustard-500 shadow-[0_0_20px_rgba(255,212,61,0.8)]" />
      </div>
      {/* Light beam */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-y-1/2 origin-left h-12 w-32"
        style={{
          background: 'linear-gradient(to right, rgba(255,212,61,0.6), transparent)',
          clipPath: 'polygon(0 30%, 100% 0, 100% 100%, 0 70%)',
        }}
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <div className="absolute bottom-3 left-3 right-3 text-white font-display text-sm leading-tight">
        Christie 4K Laser
      </div>
    </div>
  );
}

function AudioTile() {
  return (
    <div className="relative h-full w-full bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl overflow-hidden p-4">
      <div className="absolute top-3 left-3 flex items-center gap-2">
        <Volume2 className="w-4 h-4 text-white/80" />
        <span className="text-[10px] tracking-widest text-white/80 font-mono">AUDIO</span>
      </div>
      {/* Animated bars */}
      <div className="absolute inset-0 flex items-center justify-center gap-1">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="w-1 bg-white/70 rounded-full"
            animate={{ height: [8, 24 + (i % 4) * 8, 8] }}
            transition={{
              duration: 0.8 + (i % 3) * 0.2,
              repeat: Infinity,
              delay: i * 0.05,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
      <div className="absolute bottom-3 left-3 right-3 text-white font-display text-sm leading-tight">
        Dolby Atmos
      </div>
    </div>
  );
}

function SeatingTile() {
  return (
    <div className="relative h-full w-full bg-gradient-to-br from-mustard-400 to-mustard-600 rounded-2xl overflow-hidden p-5">
      <div className="absolute top-3 left-3 flex items-center gap-2">
        <Armchair className="w-4 h-4 text-ink-900/80" />
        <span className="text-[10px] tracking-widest text-ink-900/80 font-mono">SEATING</span>
      </div>
      {/* Mini seats illustration */}
      <div className="absolute inset-0 flex items-end justify-center pb-12">
        <div className="grid grid-cols-5 gap-1">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-ink-900 rounded-sm"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.08,
              }}
            />
          ))}
        </div>
      </div>
      <div className="absolute bottom-3 left-3 right-3 text-ink-900 font-display text-sm leading-tight font-semibold">
        Luxury Recliners
      </div>
    </div>
  );
}

function InteriorTile() {
  return (
    <div className="relative h-full w-full bg-gradient-to-br from-lavender-500 to-lavender-700 rounded-2xl overflow-hidden p-5">
      <div className="absolute top-3 left-3 flex items-center gap-2">
        <Palette className="w-4 h-4 text-white/80" />
        <span className="text-[10px] tracking-widest text-white/80 font-mono">INTERIORS</span>
      </div>
      {/* Concentric curtain rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[40, 60, 80].map((size, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border-2 border-white/40"
            style={{ width: `${size}%`, height: `${size}%` }}
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{
              duration: 20 + i * 10,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
        <div className="w-8 h-8 rounded-full bg-white/80" />
      </div>
      <div className="absolute bottom-3 left-3 right-3 text-white font-display text-sm leading-tight">
        Theatre Design
      </div>
    </div>
  );
}

function TechTile() {
  return (
    <div className="relative h-full w-full bg-gradient-to-br from-ink-800 to-ink-900 rounded-2xl overflow-hidden p-5 border border-cobalt-500/30">
      <div className="absolute top-3 left-3 flex items-center gap-2">
        <Cpu className="w-4 h-4 text-cobalt-400" />
        <span className="text-[10px] tracking-widest text-cobalt-400 font-mono">3D SYSTEMS</span>
      </div>
      {/* Circuit pattern */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-40">
        <motion.path
          d="M20,50 L40,50 L40,30 L60,30 L60,70 L80,70"
          stroke="#3B5BFF"
          strokeWidth="1"
          fill="none"
          strokeDasharray="4 2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.path
          d="M10,30 L30,30 L30,60 L70,60 L70,40 L90,40"
          stroke="#7E54E9"
          strokeWidth="1"
          fill="none"
          strokeDasharray="4 2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />
        <circle cx="40" cy="50" r="2" fill="#3B5BFF" />
        <circle cx="60" cy="30" r="2" fill="#7E54E9" />
        <circle cx="60" cy="70" r="2" fill="#3B5BFF" />
      </svg>
      <div className="absolute bottom-3 left-3 right-3 text-white font-display text-sm leading-tight">
        Leonis 3D
      </div>
    </div>
  );
}

function LampTile() {
  return (
    <div className="relative h-full w-full bg-gradient-to-br from-coral-500 to-coral-700 rounded-2xl overflow-hidden p-5">
      <div className="absolute top-3 left-3 flex items-center gap-2">
        {/* <Zap className="w-4 h-4 text-white/80" /> */}
        {/* <span className="text-[10px] tracking-widest text-white/80 font-mono">LAMPS</span> */}
      </div>
      {/* Bulb shape */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="w-12 h-12 rounded-full bg-gradient-to-br from-mustard-300 to-white"
          animate={{
            scale: [1, 1.15, 1],
            boxShadow: [
              '0 0 20px rgba(255,212,61,0.5)',
              '0 0 40px rgba(255,212,61,0.9)',
              '0 0 20px rgba(255,212,61,0.5)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
      <div className="absolute bottom-3 left-3 right-3 text-white font-display text-sm leading-tight">
        USHIO Xenon
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden pt-28 pb-16"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-grid-soft opacity-30" />

      {/* Decorative orbs */}
      <motion.div
        animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-cobalt-500/10 blur-[120px]"
      />
      <motion.div
        animate={{ x: [0, -50, 0], y: [0, 40, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-coral-500/10 blur-[120px]"
      />

      {/* Top film strip */}
      <div className="absolute top-20 left-0 right-0 h-6 overflow-hidden opacity-15">
        <div className="marquee-track">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-3 shrink-0">
              {[...Array(40)].map((_, j) => (
                <div
                  key={j}
                  className="w-10 h-5 border border-current rounded-sm shrink-0 text-fg"
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-center w-full">
        {/* Left content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-10"
          >
            <span className="relative flex w-2 h-2">
              <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
              <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-500" />
            </span>
            <span className="eyebrow text-muted">
              SINCE 2019 · CINEMA TECHNOLOGY EXPERTS
            </span>
          </motion.div>

          <h1 className="editorial-hero text-[3.5rem] md:text-[5rem] lg:text-[6.5rem] xl:text-[7rem]">
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="block text-fg"
            >
              Cinema,
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.8 }}
              className="block editorial-italic"
            >
              <span className="text-grad-cinema">reimagined</span>
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="block text-fg"
            >
              for tomorrow.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="mt-10 text-lg md:text-xl text-muted max-w-xl leading-relaxed"
          >
            We renovate theatres and equip them with world-class screens, laser projectors,
            immersive audio, and luxury seating. <span className="text-fg font-medium">One partner. Every detail.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <a
              href="#contact"
              className="beam group inline-flex items-center gap-2 px-7 py-4 rounded-full bg-fg font-semibold transition-transform hover:scale-105"
              style={{ color: 'var(--bg)' }}
            >
              Start Your Project
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#showcase"
              className="group inline-flex items-center gap-2 px-7 py-4 rounded-full border border-strong hover:bg-soft transition-colors"
            >
              <Play className="w-5 h-5 text-coral-500" />
              <span>View Showcase</span>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="mt-14 grid grid-cols-3 gap-6 max-w-md"
          >
            {[
              { v: '6+', l: 'Years', c: 'text-crimson-500' },
              { v: '120+', l: 'Theatres', c: 'text-navy-700 dark:text-cobalt-400' },
              { v: '15+', l: 'Brands', c: 'text-mustard-500' },
            ].map((s, i) => (
              <div key={i} className="border-l-2 border-strong pl-4">
                <div className={`huge-number text-4xl font-bold ${s.c}`}>{s.v}</div>
                <div className="eyebrow text-soft mt-1">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right: BENTO COLLAGE — represents all services */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full"
        >
          {/* Bento grid */}
          <div className="grid grid-cols-6 grid-rows-6 gap-3 aspect-square max-w-[600px] mx-auto lg:ml-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="col-span-4 row-span-3"
            >
              <ScreenTile />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="col-span-2 row-span-2"
            >
              <ProjectorTile />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="col-span-2 row-span-2"
            >
              <TechTile />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="col-span-2 row-span-3"
            >
              <SeatingTile />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="col-span-2 row-span-3"
            >
              <AudioTile />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="col-span-2 row-span-3"
            >
              <InteriorTile />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="col-span-2 row-span-3"
            >
              <LampTile />
            </motion.div>
          </div>

          {/* Floating sparkle decoration */}
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ rotate: { duration: 20, repeat: Infinity, ease: 'linear' }, scale: { duration: 3, repeat: Infinity } }}
            className="absolute -top-6 -right-6 text-mustard-500"
          >
            <Sparkles className="w-12 h-12" />
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="eyebrow text-soft">SCROLL</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-12 bg-gradient-to-b from-fg to-transparent"
        />
      </motion.div>
    </section>
  );
}
