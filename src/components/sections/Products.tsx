'use client';

import {
  useDeferredValue,
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Monitor, Projector, Cpu, Zap, Volume2, Armchair, ArrowUpRight,
  Search, X, Loader2, Phone, Check,
} from 'lucide-react';
import { PRODUCTS, CONTACT } from '@/lib/data';
import Reveal, { RevealGroup, itemVariants } from '@/components/ui/Reveal';
import { Starfield, ConcentricRings, ScreenFrames } from '@/components/ui/Decorations';
import { SkeletonGrid } from '@/components/ui/Skeleton';
import Tabs from '@/components/ui/Tabs';
import Dialog from '@/components/ui/Dialog';
import { useProductFilter } from '@/hooks/useProductFilter';
import { useStockStatus } from '@/hooks/useStockStatus';
import {
  useUIStore,
  selectSearchQuery,
  selectActiveFilter,
} from '@/store/ui-store';

const iconMap = { Monitor, Projector, Cpu, Zap, Volume2, Armchair };

// Map product accent to navy-section friendly colors
const cardAccent = {
  cobalt: { glow: '#3B5BFF', text: 'text-cobalt-300' },
  coral: { glow: '#FF5A38', text: 'text-coral-300' },
  emerald: { glow: '#16A35C', text: 'text-emerald-300' },
  lavender: { glow: '#7E54E9', text: 'text-lavender-300' },
};

// Filter tabs → accent values used in data.ts
const FILTERS = [
  { label: 'All Products', value: 'all' },
  { label: 'Projectors', value: 'coral' },
  { label: 'Screens', value: 'cobalt' },
  { label: 'Audio', value: 'emerald' },
  { label: '3D Systems', value: 'lavender' },
] as const;

const PRODUCTS_PER_PAGE = 3;

type Product = (typeof PRODUCTS)[number];

// Live stock badge — polls /api/stock every 30s via useStockStatus.
function StockBadge({ productId }: { productId: string }) {
  const { status, label, color } = useStockStatus(productId);

  return (
    <div className="group/badge relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur">
      <motion.span
        key={status}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="text-[10px] font-medium uppercase tracking-wider text-white/80">
        {label}
      </span>
      {/* Tooltip */}
      <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/80 px-2 py-1 text-[10px] text-white opacity-0 group-hover/badge:opacity-100 transition-opacity">
        Stock updates every 30 seconds
      </span>
    </div>
  );
}

function ProductCard({ product, idx }: { product: Product; idx: number }) {
  const Icon = iconMap[product.icon as keyof typeof iconMap];
  const accent = cardAccent[product.accent as keyof typeof cardAccent];

  return (
    <motion.article
      variants={itemVariants}
      className="group relative lift"
    >
      <div className="relative h-full flex flex-col overflow-hidden rounded-3xl bg-navy-800/50 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          {/* next/image: automatic WebP, lazy loading, prevents CLS, improves LCP */}
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={idx < 3}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/40 to-transparent" />

          {/* Icon badge */}
          <div
            className="absolute top-4 left-4 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ backgroundColor: accent.glow }}
          >
            {Icon && <Icon className="w-6 h-6 text-white" />}
          </div>

          {/* Arrow */}
          <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
            <ArrowUpRight className="w-4 h-4" style={{ color: accent.glow }} />
          </div>
        </div>

        {/* Content */}
        <div className="relative p-7 flex flex-col flex-1">
          {/* Stock badge */}
          <div className="flex items-center justify-between mb-3">
            <div
              className="text-xs font-mono tracking-wider font-semibold"
              style={{ color: accent.glow }}
            >
              0{idx + 1} · CINEMA TECH
            </div>
            <StockBadge productId={product.id} />
          </div>

          <h3 className="font-display text-2xl mb-2 text-white">
            {product.name}
          </h3>
          <p className="text-sm italic mb-3" style={{ color: accent.glow }}>
            {product.tagline}
          </p>
          <p className="text-sm text-white/60 leading-relaxed mb-5">
            {product.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {product.features.map((f) => (
              <span
                key={f}
                className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 font-medium"
              >
                {f}
              </span>
            ))}
          </div>

          {/* Learn More → Dialog */}
          <div className="mt-auto">
            <Dialog>
              <Dialog.Trigger className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors cursor-pointer">
                Learn More
                <ArrowUpRight className="w-4 h-4" />
              </Dialog.Trigger>
              <Dialog.Content title={product.name}>
                <ProductDetails product={product} accentHex={accent.glow} />
              </Dialog.Content>
            </Dialog>
          </div>
        </div>

        {/* Bottom accent */}
        <div
          className="absolute bottom-0 left-0 right-0 h-0.5 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
          style={{ backgroundColor: accent.glow }}
        />
      </div>
    </motion.article>
  );
}

function ProductDetails({ product, accentHex }: { product: Product; accentHex: string }) {
  return (
    <div className="space-y-5">
      <div className="relative aspect-[16/9] rounded-xl overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 640px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      <p className="text-sm italic" style={{ color: accentHex }}>
        {product.tagline}
      </p>
      <p className="text-sm text-muted leading-relaxed">{product.description}</p>

      <div>
        <h4 className="text-xs uppercase tracking-wider text-muted font-semibold mb-3">
          Key Features
        </h4>
        <ul className="grid sm:grid-cols-2 gap-2">
          {product.features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-fg">
              <Check className="w-4 h-4 shrink-0" style={{ color: accentHex }} />
              {f}
            </li>
          ))}
        </ul>
      </div>

      <a
        href={`tel:${CONTACT.phone.replace(/\s/g, '')}`}
        className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-full text-white font-semibold text-sm transition-transform hover:scale-[1.02]"
        style={{ backgroundColor: accentHex }}
      >
        <Phone className="w-4 h-4" />
        Get a Quote — {CONTACT.phone}
      </a>
    </div>
  );
}

export default function Products() {
  // --- global UI state ---
  const searchQuery = useUIStore(selectSearchQuery);
  const activeFilter = useUIStore(selectActiveFilter);
  const setSearchQuery = useUIStore((s) => s.setSearchQuery);
  const setActiveFilter = useUIStore((s) => s.setActiveFilter);

  // --- concurrent rendering: keep typing responsive while filtering ---
  const [isPending, startTransition] = useTransition();
  const deferredQuery = useDeferredValue(searchQuery);

  // Filtering runs against the deferred query (debounce inside the hook is
  // bypassed when an override is passed).
  const { filteredProducts, isFiltering } = useProductFilter(PRODUCTS, deferredQuery);

  // --- infinite scroll paging ---
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const hasMore = visibleCount < filteredProducts.length;

  // Reset paging whenever the result set changes (new search or filter).
  useEffect(() => {
    setVisibleCount(PRODUCTS_PER_PAGE);
  }, [deferredQuery, activeFilter]);

  // Native IntersectionObserver — no external library.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setVisibleCount((prev) => prev + PRODUCTS_PER_PAGE);
        }
      },
      { threshold: 0.1 },
    );
    const node = sentinelRef.current;
    if (node) observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, visibleCount]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  // --- handlers ---
  const handleSearchChange = (value: string) => {
    startTransition(() => setSearchQuery(value));
  };

  const resetFilters = () => {
    startTransition(() => {
      setSearchQuery('');
      setActiveFilter('all');
    });
  };

  return (
    <section id="products" className="relative section-pad overflow-hidden bg-navy-900 text-white">
      {/* Grain */}
      <div className="absolute inset-0 grain pointer-events-none" />

      {/* CREATIVE BG 1: Starfield */}
      <div className="absolute inset-0 text-mustard-300/50 pointer-events-none">
        <Starfield color="currentColor" count={100} className="w-full h-full" />
      </div>

      {/* CREATIVE BG 2: Concentric rings center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/10">
        <ConcentricRings color="currentColor" className="w-[800px] h-[800px]" />
      </div>

      {/* CREATIVE BG 3: Screen frames overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%]">
        <ScreenFrames color="white" className="absolute inset-0" />
      </div>

      {/* CREATIVE BG 4: Glowing orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cobalt-500/15 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-lavender-500/15 rounded-full blur-[150px]" />

      <div className="relative max-w-7xl mx-auto px-6 z-10">
        {/* Header — magazine editorial */}
        <div className="text-center mb-20">
          <Reveal direction="up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 mb-6">
              <Monitor className="w-4 h-4 text-mustard-300" />
              <span className="eyebrow text-white">CURATED EXCELLENCE</span>
            </div>
          </Reveal>
          <Reveal direction="up" delay={0.1}>
            <h2 className="editorial-hero text-5xl md:text-7xl lg:text-8xl max-w-4xl mx-auto text-white">
              Premium products that
              <br />
              <span className="editorial-italic text-mustard-300">define</span> modern cinema
            </h2>
          </Reveal>
          <Reveal direction="up" delay={0.2}>
            <p className="mt-8 text-white/70 max-w-2xl mx-auto text-lg leading-relaxed">
              Every screen, every speaker, every seat — handpicked from the world&apos;s most respected cinema technology brands.
            </p>
          </Reveal>
        </div>

        {/* Search + filter bar */}
        <Reveal direction="up" delay={0.3}>
          <div className="max-w-2xl mx-auto mb-14">
            {/* Search input */}
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search projectors, screens, audio..."
                aria-label="Search products"
                className="w-full rounded-full bg-elev border border-soft pl-14 pr-12 py-4 text-fg placeholder:text-muted focus:outline-none focus:border-cobalt-500 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={resetFilters}
                  aria-label="Clear search"
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center bg-soft hover:bg-soft/70 transition-colors"
                >
                  <X className="w-4 h-4 text-muted" />
                </button>
              )}
            </div>

            {/* Filter tabs (compound Tabs component) */}
            <Tabs
              defaultValue="all"
              value={activeFilter}
              onValueChange={setActiveFilter}
              className="mt-5"
            >
              <Tabs.List className="overflow-x-auto justify-start sm:justify-center border-white/15">
                {FILTERS.map((f) => (
                  <Tabs.Trigger key={f.value} value={f.value}>
                    {f.label}
                  </Tabs.Trigger>
                ))}
              </Tabs.List>
            </Tabs>

            {/* Result count */}
            <div className="flex items-center justify-center gap-2 mt-6 text-sm text-white/60">
              <span>
                Showing {filteredProducts.length} of {PRODUCTS.length} products
              </span>
              {isFiltering && (
                <Loader2 className="w-4 h-4 animate-spin text-mustard-300" />
              )}
            </div>
          </div>
        </Reveal>

        {filteredProducts.length === 0 ? (
          /* Empty state */
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-6">
              <Search className="w-7 h-7 text-white/60" />
            </div>
            <p className="text-white/80 text-lg mb-2">
              No products found for &lsquo;{searchQuery}&rsquo;
            </p>
            <p className="text-white/50 text-sm mb-6">
              Try a different search term or clear the filter.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            {/* Magazine-style products grid */}
            <div className={`transition-opacity duration-300 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
              <RevealGroup className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleProducts.map((product, idx) => (
                  <ProductCard key={product.id} product={product} idx={idx} />
                ))}
              </RevealGroup>
            </div>

            {/* Sentinel — triggers loading more when scrolled into view */}
            <div ref={sentinelRef} className="h-10 w-full" aria-hidden="true" />

            {hasMore ? (
              <SkeletonGrid cols={3} count={PRODUCTS_PER_PAGE} className="mt-6" />
            ) : (
              <p className="text-center text-white/50 text-sm mt-10">
                All products loaded ✓
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
