'use client';

import { motion } from 'framer-motion';
import { PROCESS_STEPS, ACCENT_MAP } from '@/lib/data';
import Reveal from '@/components/ui/Reveal';
import { FlowingCurves, ConcentricRings } from '@/components/ui/Decorations';

export default function Process() {
  return (
    <section id="process" className="relative section-pad overflow-hidden bg-surface">
      {/* CREATIVE BG 1: Flowing curves */}
      <div className="absolute inset-0 text-lavender-500/15 pointer-events-none">
        <FlowingCurves color="currentColor" className="w-full h-full" />
      </div>

      {/* CREATIVE BG 2: Concentric rings */}
      <div className="absolute top-20 right-0 text-lavender-500/10">
        <ConcentricRings color="currentColor" className="w-[500px] h-[500px]" />
      </div>

      {/* CREATIVE BG 3: Dotted grid */}
      <div className="absolute inset-0 bg-dots opacity-50 pointer-events-none" />

      {/* Big editorial digit watermark */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="absolute bottom-10 right-10 pointer-events-none"
        style={{
          fontFamily: 'var(--font-fraunces)',
          fontSize: '20rem',
          fontWeight: 800,
          letterSpacing: '-0.08em',
          lineHeight: 1,
          color: 'var(--border-strong)',
          fontStyle: 'italic',
        }}
      >
        05
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-6 z-10">
        <div className="text-center mb-24">
          <Reveal direction="up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-elev border border-soft mb-6">
              <span className="eyebrow text-lavender-500">OUR PROCESS</span>
            </div>
          </Reveal>
          <Reveal direction="up" delay={0.1}>
            <h2 className="editorial-hero text-5xl md:text-7xl lg:text-8xl text-fg">
              From <span className="editorial-italic text-lavender-500">concept</span>
              <br />
              to <span className="editorial-italic text-crimson-500">curtain-up</span>
            </h2>
          </Reveal>
          <Reveal direction="up" delay={0.2}>
            <p className="mt-8 text-muted max-w-2xl mx-auto text-lg leading-relaxed">
              A proven five-stage approach refined over six years and 120+ theatre projects
            </p>
          </Reveal>
        </div>

        <div className="relative">
          {/* Animated vertical progress line */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: '-200px' }}
            transition={{ duration: 2, ease: 'easeInOut' }}
            className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-1/2 origin-top"
            style={{
              background:
                'linear-gradient(to bottom, transparent, #3B5BFF, #7E54E9, #FF5A38, #16A35C, transparent)',
            }}
          />

          {PROCESS_STEPS.map((step, i) => {
            const isLeft = i % 2 === 0;
            const accent = ACCENT_MAP[step.accent as keyof typeof ACCENT_MAP];

            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={`relative mb-16 md:mb-24 flex items-center ${
                  isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <div className={`flex-1 ml-20 md:ml-0 ${isLeft ? 'md:pr-20 md:text-right' : 'md:pl-20'}`}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.3 }}
                    className="inline-block"
                  >
                    <div className="relative p-10 rounded-3xl bg-elev border border-soft hover:border-strong transition-colors max-w-lg shadow-sm">
                      <div className="huge-number text-7xl font-black mb-4" style={{ color: accent.hex }}>
                        {step.step}
                      </div>
                      <h3 className="font-display text-3xl text-fg mb-4 leading-tight">
                        {step.title}
                      </h3>
                      <p className="text-muted leading-relaxed">{step.desc}</p>

                      <div
                        className="absolute top-6 right-6 w-2 h-2 rounded-full animate-pulse"
                        style={{ backgroundColor: accent.hex }}
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Center node */}
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 z-10">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.4, duration: 0.7, type: 'spring' }}
                    className="relative w-16 h-16 flex items-center justify-center"
                  >
                    <div
                      className="absolute inset-0 rounded-full animate-ping opacity-30"
                      style={{ backgroundColor: accent.hex }}
                    />
                    <div
                      className="relative w-14 h-14 rounded-full flex items-center justify-center font-display font-bold text-white shadow-xl"
                      style={{
                        background: `linear-gradient(135deg, ${accent.hex}, ${accent.hex}dd)`,
                        boxShadow: `0 0 30px ${accent.hex}60`,
                      }}
                    >
                      {step.step}
                    </div>
                  </motion.div>
                </div>

                <div className="hidden md:block flex-1" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
