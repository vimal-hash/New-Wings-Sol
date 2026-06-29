'use client';

import { motion } from 'framer-motion';
import {
  Palette, Monitor, Projector, Volume2, Armchair, Wrench, ArrowRight,
} from 'lucide-react';
import { SERVICES, ACCENT_MAP } from '@/lib/data';
import Reveal, { RevealGroup, itemVariants } from '@/components/ui/Reveal';
import { SeatGrid, FlowingCurves } from '@/components/ui/Decorations';

const iconMap = { Palette, Monitor, Projector, Volume2, Armchair, Wrench };

export default function Services() {
  return (
    <section id="services" className="relative section-pad overflow-hidden bg-surface">
      {/* CREATIVE BG 1: Seat grid pattern */}
      <div className="absolute inset-0 text-coral-500/15 pointer-events-none">
        <SeatGrid color="currentColor" className="w-full h-full" />
      </div>

      {/* CREATIVE BG 2: Flowing curves */}
      <div className="absolute inset-0 text-coral-500/10 pointer-events-none">
        <FlowingCurves color="currentColor" className="w-full h-full" />
      </div>

      {/* CREATIVE BG 3: Soft orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-coral-500/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-lavender-500/10 rounded-full blur-[150px]" />

      <div className="relative max-w-7xl mx-auto px-6 z-10">
        <div className="grid md:grid-cols-2 gap-12 items-end mb-20">
          <div>
            <Reveal direction="up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-elev border border-soft mb-6">
                <span className="eyebrow text-coral-500">WHAT WE DO</span>
              </div>
            </Reveal>
            <Reveal direction="up" delay={0.1}>
              <h2 className="editorial-hero text-5xl md:text-7xl lg:text-8xl text-fg leading-tight">
                Every service
                <br />
                <span className="editorial-italic text-coral-500">your theatre</span>
                <br />
                will ever need
              </h2>
            </Reveal>
          </div>
          <Reveal direction="up" delay={0.2}>
            <p className="text-muted text-lg leading-relaxed">
              One partner for design, supply, installation, and lifelong support — so you can focus on what matters: the audience experience.
            </p>
          </Reveal>
        </div>

        {/* Magazine-style grid */}
        <RevealGroup className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-soft rounded-3xl overflow-hidden border border-soft shadow-sm">
          {SERVICES.map((service, i) => {
            const Icon = iconMap[service.icon as keyof typeof iconMap];
            const accent = ACCENT_MAP[service.accent as keyof typeof ACCENT_MAP];

            return (
              <motion.div
                key={service.title}
                variants={itemVariants}
                className="group relative bg-elev p-10 md:p-12 hover:bg-soft transition-all cursor-pointer overflow-hidden"
              >
                <div className="font-mono text-xs text-soft mb-8">
                  0{i + 1} / 0{SERVICES.length}
                </div>

                <motion.div
                  whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                  style={{
                    backgroundColor: `${accent.hex}15`,
                    border: `1px solid ${accent.hex}30`,
                  }}
                >
                  {Icon && <Icon className="w-7 h-7" style={{ color: accent.hex }} />}
                </motion.div>

                <h3 className="font-display text-2xl md:text-3xl text-fg mb-4 leading-tight">
                  {service.title}
                </h3>
                <p className="text-muted leading-relaxed text-sm mb-8">
                  {service.desc}
                </p>

                <div
                  className="inline-flex items-center gap-2 text-sm font-semibold transition-colors"
                  style={{ color: accent.hex }}
                >
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>

                <div
                  className="absolute top-0 left-0 right-0 h-0.5 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                  style={{ backgroundColor: accent.hex }}
                />
              </motion.div>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
