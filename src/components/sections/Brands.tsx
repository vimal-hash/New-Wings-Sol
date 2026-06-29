'use client';

import { motion } from 'framer-motion';
import { BadgeCheck, Star } from 'lucide-react';
import { BRANDS } from '@/lib/data';
import Reveal from '@/components/ui/Reveal';
import { FilmReel, FlowingCurves } from '@/components/ui/Decorations';

export default function Brands() {
  const looped = [...BRANDS, ...BRANDS];

  return (
    <section className="relative section-pad overflow-hidden bg-crimson-500 text-white">
      {/* Grain overlay */}
      <div className="absolute inset-0 grain pointer-events-none" />

      {/* CREATIVE BG 1: Film reels rotating */}
      <div className="absolute -left-32 top-20 text-white/15">
        <FilmReel size={400} color="currentColor" speed={50} />
      </div>
      <div className="absolute -right-32 bottom-20 text-white/15">
        <FilmReel size={400} color="currentColor" speed={70} reverse />
      </div>

      {/* CREATIVE BG 2: Flowing curves */}
      <div className="absolute inset-0 text-white/20 pointer-events-none">
        <FlowingCurves color="currentColor" className="w-full h-full" />
      </div>

      {/* CREATIVE BG 3: Animated stripes background */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.08]" preserveAspectRatio="none">
        <defs>
          <pattern id="diag-stripes" patternUnits="userSpaceOnUse" width="40" height="40" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="40" stroke="white" strokeWidth="2" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#diag-stripes)" />
      </svg>

      {/* Top/bottom subtle vignette */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-crimson-700/50 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-crimson-700/50 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 mb-16 text-center relative z-10">
        <Reveal direction="up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur border border-white/20 mb-6">
            <BadgeCheck className="w-4 h-4 text-mustard-300" />
            <span className="eyebrow text-white">AUTHORIZED PARTNERS</span>
          </div>
        </Reveal>
        <Reveal direction="up" delay={0.1}>
          <h2 className="editorial-hero text-5xl md:text-7xl lg:text-8xl text-white">
            Powering the
            <br />
            <span className="editorial-italic text-white">world&apos;s</span> best cinemas
          </h2>
        </Reveal>
        <Reveal direction="up" delay={0.2}>
          <p className="mt-6 text-white/80 max-w-2xl mx-auto text-lg">
            Official dealership and integration partners with global leaders in cinema technology
          </p>
        </Reveal>
      </div>

      {/* Marquee */}
      <div className="relative z-10">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-crimson-500 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-crimson-500 to-transparent z-10" />

        <div className="marquee-track gap-5 py-6">
          {looped.map((brand, i) => (
            <div key={`${brand.name}-${i}`} className="shrink-0 group">
              <div className="relative px-10 py-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:border-white/50 hover:bg-white/15 transition-all hover:scale-105 hover:-translate-y-1 min-w-[260px]">
                <div className="font-display text-2xl font-bold text-white mb-1">
                  {brand.name}
                </div>
                <div className="eyebrow text-grey">
                  {brand.tagline}
                </div>
                <BadgeCheck className="absolute -top-2 -right-2 w-6 h-6 text-[rgb(84,211,128)] bg-crimson-500 rounded-full p-0.5 border-2 border-white/30" />
              </div>
            </div>
          ))}
        </div>

        {/* Second marquee row reverse */}
        <div className="marquee-track gap-5 py-6 mt-4" style={{ animationDirection: 'reverse', animationDuration: '50s' }}>
          {looped.map((brand, i) => (
            <div key={`r-${brand.name}-${i}`} className="shrink-0 group">
              <div className="relative px-10 py-6 bg-crimson-700/40 backdrop-blur-md rounded-2xl border border-white/15 hover:border-white/40 hover:bg-crimson-700/60 transition-all hover:scale-105 hover:-translate-y-1 min-w-[260px]">
                <div className="font-display text-2xl font-bold text-white mb-1">
                  {brand.name}
                </div>
                <div className="eyebrow text-[rgb(84,211,128)]">
                  {brand.tagline}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom stat row */}
      <Reveal direction="up" delay={0.3}>
        <div className="relative z-10 max-w-7xl mx-auto px-6 mt-16">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 text-center md:text-left">
            <div className="flex items-center gap-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-mustard-300 fill-mustard-300" />
                ))}
              </div>
              <span className="text-white font-medium">Trusted by 120+ exhibitors</span>
            </div>
            <div className="hidden md:block w-px h-8 bg-white/20" />
            <div className="text-white/80 text-sm">
              <span className="font-display text-2xl text-white">15+</span> Global Brand Partnerships
            </div>
            <div className="hidden md:block w-px h-8 bg-white/20" />
            <div className="text-white/80 text-sm">
              <span className="font-display text-2xl text-white">100%</span> Authorized Dealership
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
