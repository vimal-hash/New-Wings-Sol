'use client';

import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { STATS } from '@/lib/data';
import Reveal from '@/components/ui/Reveal';
import { SoundWave, FilmStrip, TicketsFloating } from '@/components/ui/Decorations';

export default function Stats() {
  return (
    <section className="relative section-pad overflow-hidden bg-mustard-400 text-ink-900">
      {/* Grain */}
      <div className="absolute inset-0 grain pointer-events-none" />

      {/* CREATIVE BG 1: Big sound wave */}
      <div className="absolute top-0 left-0 right-0 h-64 text-ink-900/10 pointer-events-none">
        <SoundWave color="currentColor" bars={50} className="w-full h-full" />
      </div>

      {/* CREATIVE BG 2: Floating tickets */}
      <div className="absolute inset-0 text-ink-900/15 pointer-events-none">
        <TicketsFloating color="currentColor" className="w-full h-full" />
      </div>

      {/* CREATIVE BG 3: Film strip at bottom */}
      <div className="absolute bottom-10 left-0 right-0 h-12 overflow-hidden text-ink-900/15 pointer-events-none">
        <FilmStrip color="currentColor" />
      </div>

      {/* CREATIVE BG 4: Large editorial number */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 0.07, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-ink-900 pointer-events-none"
        style={{ fontFamily: 'var(--font-fraunces)', fontSize: '40rem', fontWeight: 800, letterSpacing: '-0.08em', lineHeight: 1 }}
      >
        6
      </motion.div>

      {/* Sun-burst rays */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 100, repeat: Infinity, ease: 'linear' }}
        className="absolute -top-32 -left-32 w-[600px] h-[600px] pointer-events-none opacity-10"
      >
        <svg viewBox="0 0 200 200">
          {[...Array(24)].map((_, i) => (
            <line
              key={i}
              x1="100"
              y1="100"
              x2="100"
              y2="20"
              stroke="currentColor"
              strokeWidth="1"
              transform={`rotate(${i * 15} 100 100)`}
              className="text-ink-900"
            />
          ))}
        </svg>
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-6 z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <Reveal direction="up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ink-900 text-mustard-300 mb-6">
              <TrendingUp className="w-4 h-4" />
              <span className="eyebrow">BY THE NUMBERS</span>
            </div>
          </Reveal>
          <Reveal direction="up" delay={0.1}>
            <h2 className="editorial-hero text-5xl md:text-7xl lg:text-8xl text-ink-900">
              A track record that
              <br />
              <span className="editorial-italic text-white">speaks</span>
            </h2>
          </Reveal>
          <Reveal direction="up" delay={0.2}>
            <p className="mt-6 text-ink-900/70 max-w-2xl mx-auto text-lg">
              Six years. Hundreds of theatres. Thousands of happy moviegoers.
            </p>
          </Reveal>
        </div>

        {/* Editorial-style stats with HUGE numbers */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="group relative text-center lg:text-left"
            >
              <div className="relative">
                <div className="huge-number text-7xl md:text-8xl lg:text-[7rem] xl:text-[8rem] font-black text-ink-900 leading-none">
                  {stat.value}
                </div>
                <div className="mt-4 font-display text-lg text-ink-900 font-semibold">
                  {stat.label}
                </div>
                <div className="eyebrow text-ink-900/60 mt-1">
                  {stat.sub}
                </div>
                <div className="font-mono text-xs text-ink-900/40 mt-3 lg:block hidden">
                  0{i + 1} / 04
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Decorative divider */}
        <Reveal direction="up" delay={0.4}>
          <div className="mt-20 flex items-center gap-4 text-ink-900">
            <div className="h-px flex-1 bg-ink-900/30" />
            <span className="eyebrow whitespace-nowrap">CINEMA · BUILT WITH CARE</span>
            <div className="h-px flex-1 bg-ink-900/30" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
