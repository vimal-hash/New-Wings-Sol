'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, ArrowUpRight } from 'lucide-react';
import { SHOWCASE_PROJECTS, ACCENT_MAP } from '@/lib/data';
import Reveal from '@/components/ui/Reveal';
import { CurtainFolds, FilmReel } from '@/components/ui/Decorations';

export default function Showcase() {
  return (
    <section id="showcase" className="relative section-pad overflow-hidden bg-soft">
      {/* CREATIVE BG 1: Top curtain folds */}
      <div className="absolute top-0 left-0 right-0 h-32 text-emerald-500/15 pointer-events-none">
        <CurtainFolds color="currentColor" className="w-full h-full" />
      </div>

      {/* CREATIVE BG 2: Bottom film reels */}
      <div className="absolute -bottom-32 -left-32 text-emerald-500/10">
        <FilmReel size={400} color="currentColor" speed={80} />
      </div>
      <div className="absolute -bottom-32 -right-32 text-cobalt-500/10">
        <FilmReel size={400} color="currentColor" speed={100} reverse />
      </div>

      {/* CREATIVE BG 3: Soft blobs */}
      <div className="absolute top-1/3 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/3 -right-32 w-96 h-96 bg-cobalt-500/10 rounded-full blur-[120px]" />

      {/* Big editorial number watermark */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.05 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="absolute top-1/2 right-10 -translate-y-1/2 pointer-events-none"
        style={{
          fontFamily: 'var(--font-fraunces)',
          fontSize: '20rem',
          fontWeight: 800,
          letterSpacing: '-0.08em',
          lineHeight: 1,
          color: 'var(--fg)',
          fontStyle: 'italic',
        }}
      >
        120
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-6 z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-20 gap-8">
          <div>
            <Reveal direction="up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-elev border border-soft mb-6">
                <span className="eyebrow text-emerald-500">SELECTED WORK</span>
              </div>
            </Reveal>
            <Reveal direction="up" delay={0.1}>
              <h2 className="editorial-hero text-5xl md:text-7xl lg:text-8xl text-fg max-w-3xl">
                Theatres we have
                <br />
                <span className="editorial-italic text-emerald-500">brought to life</span>
              </h2>
            </Reveal>
          </div>
          <Reveal direction="up" delay={0.2}>
            <p className="text-muted max-w-md text-lg">
              Each project is a unique blend of design, technology, and storytelling — built to delight audiences for decades.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-[300px]">
          {SHOWCASE_PROJECTS.map((project, i) => {
            const span = i === 0 ? 'md:col-span-2 md:row-span-2' : i === 3 ? 'md:col-span-2' : '';
            const accent = ACCENT_MAP[project.accent as keyof typeof ACCENT_MAP];

            return (
              <motion.article
                key={project.title}
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -8 }}
                className={`group relative overflow-hidden rounded-3xl cursor-pointer bg-elev border border-soft shadow-sm ${span}`}
              >
                {/* next/image: automatic WebP, lazy loading, prevents CLS, improves LCP */}
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                  priority={i === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div
                  className="absolute inset-0 mix-blend-color opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                  style={{ backgroundColor: accent.hex }}
                />

                <div
                  className="absolute top-5 left-5 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider font-bold text-white shadow-md"
                  style={{ backgroundColor: accent.hex }}
                >
                  {project.category}
                </div>

                <div className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/95 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all group-hover:rotate-45">
                  <ArrowUpRight className="w-5 h-5" style={{ color: accent.hex }} />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <h3 className="font-display text-3xl md:text-4xl text-white mb-2 leading-tight">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <MapPin className="w-4 h-4" />
                    {project.location}
                  </div>
                </div>

                <div
                  className="absolute inset-0 rounded-3xl border-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{ borderColor: accent.hex }}
                />
              </motion.article>
            );
          })}
        </div>

        <Reveal direction="up" delay={0.3}>
          <div className="text-center mt-20">
            <p className="text-muted mb-8 text-lg">
              From boutique single screens to 12-screen multiplexes — we build them all.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 transition-colors font-semibold beam"
            >
              Discuss Your Project
              <ArrowUpRight className="w-5 h-5" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
