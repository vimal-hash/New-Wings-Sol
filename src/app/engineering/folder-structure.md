# NW Solutions — Folder Structure

## Philosophy

Feature-based structure: each feature owns its code.
Not layer-based (all components together, all hooks together).

## Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Homepage (ISR 1h)
│   ├── admin/              # Admin panel (SSR)
│   ├── products/           # Products page (ISR 30m)
│   ├── showcase/           # Portfolio (SSG 24h)
│   ├── engineering/        # This documentation
│   ├── api/
│   │   ├── chat/           # AI chatbot SSE endpoint
│   │   ├── stock/          # Real-time stock polling
│   │   └── upload/         # Chunked file upload
├── components/
│   ├── sections/           # Page sections (Hero, Products, etc.)
│   ├── admin/              # Admin-only components
│   ├── ui/                 # Shared UI primitives
│   └── seo/                # SEO components (JsonLD)
├── hooks/                  # Custom React hooks
├── store/                  # Zustand stores
├── lib/                    # Utilities and configs
├── i18n/                   # Translation files
└── __tests__/              # Unit and integration tests

e2e/                        # Playwright E2E tests
public/
├── sw.js                   # Service Worker
├── manifest.json           # PWA manifest
└── workers/                # Web Workers
```

## Key Decisions

- hooks/ separate from components/ — hooks are logic, components are UI
- admin/ separate from sections/ — different security context
- i18n/ at root level — translations are app-wide concern
