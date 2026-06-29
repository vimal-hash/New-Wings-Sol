'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, HelpCircle } from 'lucide-react';
import { FAQS } from '@/lib/data';
import Reveal from '@/components/ui/Reveal';
import { FlowingCurves, ConcentricRings } from '@/components/ui/Decorations';

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative section-pad overflow-hidden bg-surface">
      {/* CREATIVE BG 1: Flowing curves */}
      <div className="absolute inset-0 text-emerald-500/15 pointer-events-none">
        <FlowingCurves color="currentColor" className="w-full h-full" />
      </div>

      {/* CREATIVE BG 2: Concentric rings */}
      <div className="absolute top-20 -left-32 text-emerald-500/10">
        <ConcentricRings color="currentColor" className="w-[500px] h-[500px]" />
      </div>

      {/* CREATIVE BG 3: Soft orbs */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px]" />
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-cobalt-500/10 rounded-full blur-[150px]" />

      <div className="relative max-w-5xl mx-auto px-6 z-10">
        <div className="text-center mb-20">
          <Reveal direction="up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-elev border border-soft mb-6">
              <HelpCircle className="w-4 h-4 text-emerald-500" />
              <span className="eyebrow text-emerald-500">FREQUENT QUESTIONS</span>
            </div>
          </Reveal>
          <Reveal direction="up" delay={0.1}>
            <h2 className="editorial-hero text-5xl md:text-7xl lg:text-8xl text-fg">
              Everything you
              <br />
              <span className="editorial-italic text-emerald-500">need to know</span>
            </h2>
          </Reveal>
          <Reveal direction="up" delay={0.2}>
            <p className="mt-6 text-muted text-lg">
              Have a different question?{' '}
              <a href="#contact" className="text-emerald-500 font-semibold hover:underline">
                Talk to our team
              </a>
              .
            </p>
          </Reveal>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className={`relative rounded-2xl border transition-all overflow-hidden ${
                open === i
                  ? 'bg-elev border-emerald-500/50 glow-emerald'
                  : 'bg-elev border-soft hover:border-strong'
              }`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-6 p-8 md:p-10 text-left"
              >
                <div className="flex items-start gap-5 flex-1">
                  <span className="huge-number text-2xl text-emerald-500 mt-1 font-bold">
                    0{i + 1}
                  </span>
                  <span className="font-display text-xl md:text-2xl text-fg leading-tight">
                    {faq.q}
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: open === i ? 45 : 0 }}
                  transition={{ duration: 0.3 }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                    open === i
                      ? 'bg-emerald-500 text-white'
                      : 'border border-strong text-fg'
                  }`}
                >
                  <Plus className="w-5 h-5" />
                </motion.div>
              </button>

              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 md:px-10 pb-10 pl-16 md:pl-20">
                      <p className="text-muted leading-relaxed text-lg">{faq.a}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
