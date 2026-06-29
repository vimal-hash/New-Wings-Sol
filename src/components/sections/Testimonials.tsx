'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { TESTIMONIALS, ACCENT_MAP } from '@/lib/data';
import Reveal, { RevealGroup, itemVariants } from '@/components/ui/Reveal';
import { SpotlightBeams, Starfield } from '@/components/ui/Decorations';

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative section-pad overflow-hidden bg-soft">
      {/* CREATIVE BG 1: Spotlight beams */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <SpotlightBeams color1="#7E54E9" color2="#FF5A38" className="absolute inset-0" />
      </div>

      {/* CREATIVE BG 2: Soft starfield */}
      <div className="absolute inset-0 text-lavender-500/40 pointer-events-none">
        <Starfield color="currentColor" count={60} className="w-full h-full" />
      </div>

      {/* CREATIVE BG 3: Big quote mark */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 0.05, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="absolute top-20 left-10 pointer-events-none"
        style={{
          fontFamily: 'var(--font-fraunces)',
          fontSize: '25rem',
          fontWeight: 800,
          lineHeight: 0.7,
          color: 'var(--fg)',
        }}
      >
        &ldquo;
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-6 z-10">
        <div className="text-center mb-20">
          <Reveal direction="up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-elev border border-soft mb-6">
              <Star className="w-4 h-4 text-lavender-500 fill-lavender-500" />
              <span className="eyebrow text-lavender-500">CLIENT VOICES</span>
            </div>
          </Reveal>
          <Reveal direction="up" delay={0.1}>
            <h2 className="editorial-hero text-5xl md:text-7xl lg:text-8xl text-fg max-w-4xl mx-auto leading-tight">
              What theatre owners
              <br />
              <span className="editorial-italic text-lavender-500">say about us</span>
            </h2>
          </Reveal>
        </div>

        <RevealGroup className="grid md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t) => {
            const accent = ACCENT_MAP[t.accent as keyof typeof ACCENT_MAP];
            return (
              <motion.article
                key={t.author}
                variants={itemVariants}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="relative group"
              >
                <div className="relative h-full p-10 md:p-12 rounded-3xl bg-elev border border-soft hover:border-strong transition-colors overflow-hidden shadow-sm">
                  <Quote
                    className="absolute top-6 right-6 w-24 h-24 opacity-10"
                    style={{ color: accent.hex }}
                    strokeWidth={1}
                  />

                  <div className="flex gap-1 mb-8">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star
                        key={j}
                        className="w-5 h-5 fill-current"
                        style={{ color: accent.hex }}
                      />
                    ))}
                  </div>

                  <p className="relative font-display text-2xl md:text-3xl text-fg leading-snug italic mb-10 font-light">
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  <div className="flex items-center gap-4 pt-6 border-t border-soft">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center font-display font-bold text-white text-lg"
                      style={{
                        background: `linear-gradient(135deg, ${accent.hex}, ${accent.hex}cc)`,
                      }}
                    >
                      {t.author.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-semibold text-fg text-lg">{t.author}</div>
                      <div className="text-sm text-muted">{t.role}</div>
                    </div>
                  </div>

                  <div
                    className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-10 group-hover:opacity-30 transition-opacity"
                    style={{ backgroundColor: accent.hex }}
                  />
                </div>
              </motion.article>
            );
          })}
        </RevealGroup>

        <Reveal direction="up" delay={0.3}>
          <div className="mt-20 flex flex-wrap items-center justify-center gap-8 text-center">
            <div className="flex items-center gap-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-lavender-500 fill-lavender-500" />
                ))}
              </div>
              <span className="huge-number text-3xl text-fg">4.9</span>
              <span className="text-muted text-sm">average rating</span>
            </div>
            <div className="w-px h-8 bg-strong" />
            <span className="text-muted text-sm">
              Based on <span className="text-fg font-semibold">120+</span> completed projects
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
