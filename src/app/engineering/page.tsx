import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Engineering Breakdown — New Wings Solutions',
  description:
    'Technical architecture documentation: stack decisions, rendering strategy, ADRs, performance targets, and interview talking points.',
};

const ACCENT = '#3B5BFF';

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const TECH_STACK: [string, string, string][] = [
  ['Next.js 14 App Router', 'SSR/ISR/SSG per route, server components', 'Remix, Vite'],
  ['TypeScript strict', 'Catches bugs at compile time, better DX', 'JavaScript'],
  ['Tailwind CSS', 'Rapid styling, consistent design tokens', 'CSS Modules, Styled Components'],
  ['Framer Motion', 'Declarative animations, layout animations', 'GSAP, CSS animations'],
  ['Zustand', 'Lightweight global state, no boilerplate', 'Redux, Jotai, Context'],
  ['TanStack Query', 'Smart caching, background refetch, optimistic updates', 'SWR, React Query v3'],
  ['Supabase', 'PostgreSQL + Auth + Storage, free tier, instant API', 'Firebase, PlanetScale'],
  ['@anthropic-ai/sdk', 'Streaming AI responses, cinema domain assistant', 'OpenAI, Gemini'],
];

const RENDERING: [string, string, string, string][] = [
  ['/ (homepage)', 'ISR', 'Content changes rarely, SEO important', '1 hour'],
  ['/admin', 'SSR (force-dynamic)', 'Always needs fresh quote data', 'Never cached'],
  ['/products', 'ISR', 'Product catalogue, moderate change', '30 mins'],
  ['/showcase', 'SSG', 'Portfolio, rarely changes', '24 hours'],
  ['/api/*', 'Dynamic', 'Real-time data, no caching', 'Per request'],
];

const FEATURE_GROUPS: { label: string; color: string; items: string[] }[] = [
  {
    label: 'Core',
    color: '#16A35C',
    items: [
      'Visual redesign', 'Smart search', 'AI chatbot', 'Real-time stock',
      'Quote system', 'Portfolio ISR', 'Lighthouse 95+', 'Dark/light mode',
      'Secure admin', 'SEO + Analytics',
    ],
  },
  {
    label: 'Browser APIs',
    color: '#3B5BFF',
    items: [
      'PWA + SW', 'Web Worker CSV', 'Chunked upload', 'BroadcastChannel',
      'IntersectionObserver', 'Drag and drop', 'Exponential backoff',
      'Resumable upload',
    ],
  },
  {
    label: 'React Patterns',
    color: '#7E54E9',
    items: [
      'Error boundaries', 'Skeleton screens', 'useTransition',
      'Compound components', 'Custom hooks', 'useMemo/useCallback',
      'i18n Tamil/Hindi',
    ],
  },
  {
    label: 'DevOps',
    color: '#E8A800',
    items: [
      'Monorepo ready', 'Bundle analyzer', 'React Testing Library',
      'Playwright E2E', 'GitHub Actions CI/CD', 'Feature folder structure',
      'next/image LCP',
    ],
  },
  {
    label: 'Security',
    color: '#EF4444',
    items: [
      'JWT + HttpOnly', 'CSRF protection', 'CSP headers', 'RBAC admin',
      'RLS Supabase',
    ],
  },
];

const ADRS: { title: string; context: string; decision: string; tradeoff: string }[] = [
  {
    title: 'ADR 1: Why Zustand over Redux',
    context: 'Need global state for cart, search, UI state',
    decision: 'Zustand — 1KB vs Redux 8KB, no boilerplate, hooks-first',
    tradeoff: 'Less devtools ecosystem than Redux',
  },
  {
    title: 'ADR 2: Why Supabase over Firebase',
    context: 'Need database + auth + storage',
    decision: 'Supabase — PostgreSQL (real SQL), open source, RLS built-in',
    tradeoff: 'Smaller community than Firebase',
  },
  {
    title: 'ADR 3: Why SSE over WebSockets for AI chat',
    context: 'AI responses are one-directional streams',
    decision: 'SSE — simpler, HTTP/1.1 compatible, automatic reconnect',
    tradeoff: 'Not bidirectional (fine for our use case)',
  },
  {
    title: 'ADR 4: Why Web Worker for CSV import',
    context: 'Large CSV files block the main thread',
    decision: 'Web Worker — runs in background thread, UI stays smooth',
    tradeoff: 'No DOM access in worker (fine for pure data parsing)',
  },
  {
    title: 'ADR 5: Why ISR over SSR for homepage',
    context: 'Homepage has SEO content that rarely changes',
    decision: 'ISR revalidate 3600 — fast as static, fresh every hour',
    tradeoff: '1 hour stale window (acceptable for marketing content)',
  },
];

const PERFORMANCE: [string, string, string][] = [
  ['LCP', '< 2.5s', 'next/image priority on hero, ISR pre-rendering'],
  ['FID', '< 100ms', 'useTransition for search, Web Worker for heavy tasks'],
  ['CLS', '0', 'next/image with fill, skeleton screens'],
  ['Bundle', '< 200KB JS', 'Code splitting, Zustand over Redux, dynamic imports'],
  ['Lighthouse', '95+', 'All of the above combined'],
];

const TALKING_POINTS: string[] = [
  "I used ISR for the homepage so it's as fast as a static site but refreshes automatically every hour — no manual deploys needed when content changes.",
  'The AI chatbot uses Server-Sent Events instead of WebSockets because AI responses are one-directional — SSE is simpler, works over HTTP/1.1, and auto-reconnects.',
  "I moved CSV parsing to a Web Worker so importing 10,000 products doesn't freeze the UI — the main thread stays free for user interactions.",
  'Every form uses Zod schema validation shared between frontend and backend — one source of truth, no duplicate validation logic.',
  'The admin panel uses BroadcastChannel API so if an admin logs out in one tab, all other admin tabs instantly log out too — no stale sessions.',
  'I implemented exponential backoff on all API calls — if the network fails, it retries after 1s, 2s, then 4s before giving up. This prevents hammering the server.',
  'The product search uses useDeferredValue and useTransition together — typing stays instant while filtering happens in a lower-priority render.',
];

// ---------------------------------------------------------------------------
// Building blocks
// ---------------------------------------------------------------------------

function Section({
  index,
  title,
  subtitle,
  children,
}: {
  index: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-20">
      <div className="mb-6">
        <div className="text-xs font-mono tracking-widest mb-2" style={{ color: ACCENT }}>
          {index}
        </div>
        <h2 className="text-2xl md:text-3xl font-semibold text-white/90">{title}</h2>
        {subtitle && <p className="mt-2 text-white/50">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full text-left text-sm">
        <thead className="bg-white/5 text-white/50 uppercase text-xs tracking-wider">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 font-medium whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-t border-white/10 odd:bg-white/[0.02] align-top"
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={`px-4 py-3 ${j === 0 ? 'text-white/90 font-medium' : 'text-white/60'}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function EngineeringPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        {/* Header */}
        <header className="mb-20">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-cobalt-500 via-lavender-500 to-coral-500 font-bold mb-6">
            NW
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-white/90">
            Engineering Breakdown
          </h1>
          <p className="mt-4 text-lg md:text-xl" style={{ color: ACCENT }}>
            NW Solutions — Technical Architecture Documentation
          </p>
          <p className="mt-4 max-w-2xl text-white/50 leading-relaxed">
            This page documents every architectural decision, pattern, and
            trade-off made in this project.
          </p>
        </header>

        {/* 1. Tech stack */}
        <Section index="SECTION 1" title="Tech Stack">
          <Table
            headers={['Technology', 'Why We Chose It', 'Alternative Considered']}
            rows={TECH_STACK}
          />
        </Section>

        {/* 2. Rendering strategy */}
        <Section
          index="SECTION 2"
          title="Right Tool for Each Route"
          subtitle="Rendering strategy chosen per route."
        >
          <Table
            headers={['Route', 'Strategy', 'Reason', 'Revalidate']}
            rows={RENDERING}
          />
        </Section>

        {/* 3. Features built */}
        <Section
          index="SECTION 3"
          title="40 Features Built"
          subtitle="Grouped by category."
        >
          <div className="space-y-8">
            {FEATURE_GROUPS.map((group) => (
              <div key={group.label}>
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: group.color }}
                  />
                  <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
                    {group.label}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border text-white/70"
                      style={{
                        borderColor: `${group.color}40`,
                        backgroundColor: `${group.color}12`,
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* 4. ADRs */}
        <Section
          index="SECTION 4"
          title="Architecture Decision Records"
          subtitle="Click to expand each decision."
        >
          <div className="space-y-3">
            {ADRS.map((adr) => (
              <details
                key={adr.title}
                className="group rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-4"
              >
                <summary className="cursor-pointer list-none flex items-center justify-between text-white/90 font-medium">
                  {adr.title}
                  <span className="text-white/40 group-open:rotate-45 transition-transform text-xl leading-none">
                    +
                  </span>
                </summary>
                <div className="mt-4 space-y-3 text-sm">
                  <p>
                    <span className="text-white/40 uppercase text-xs tracking-wider mr-2">
                      Context
                    </span>
                    <span className="text-white/70">{adr.context}</span>
                  </p>
                  <p>
                    <span className="text-white/40 uppercase text-xs tracking-wider mr-2">
                      Decision
                    </span>
                    <span className="text-white/70">{adr.decision}</span>
                  </p>
                  <p>
                    <span className="text-white/40 uppercase text-xs tracking-wider mr-2">
                      Trade-off
                    </span>
                    <span className="text-white/70">{adr.tradeoff}</span>
                  </p>
                </div>
              </details>
            ))}
          </div>
        </Section>

        {/* 5. Performance */}
        <Section index="SECTION 5" title="Performance Targets">
          <Table
            headers={['Metric', 'Target', 'Strategy']}
            rows={PERFORMANCE}
          />
        </Section>

        {/* 6. Interview talking points */}
        <Section index="SECTION 6" title="Key Talking Points for Interviews">
          <ol className="space-y-4">
            {TALKING_POINTS.map((point, i) => (
              <li key={i} className="flex gap-4">
                <span
                  className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white"
                  style={{ backgroundColor: ACCENT }}
                >
                  {i + 1}
                </span>
                <p className="text-white/70 leading-relaxed pt-0.5">
                  &ldquo;{point}&rdquo;
                </p>
              </li>
            ))}
          </ol>
        </Section>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-white/10 text-white/50 text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span>Built by Your Name — Full Stack Engineer</span>
          <nav className="flex items-center gap-5">
            <a href="https://github.com" className="hover:text-white transition-colors">
              GitHub
            </a>
            <a href="/" className="hover:text-white transition-colors">
              Live Site
            </a>
            <a href="/#contact" className="hover:text-white transition-colors">
              Contact
            </a>
          </nav>
        </footer>
      </div>
    </main>
  );
}
