import { withSentryConfig } from '@sentry/nextjs';
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const isDev = process.env.NODE_ENV !== 'production';

// Supabase origin the browser must be allowed to connect to (REST + realtime).
// Derived from the public env var so the CSP stays in sync with the project.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseWs = supabaseUrl.replace(/^https:/, 'wss:');
const supabaseConnect = [supabaseUrl, supabaseWs].filter(Boolean).join(' ');

/**
 * Content-Security-Policy.
 *
 * Notes on the loosened directives (each is required, not optional):
 * - script-src needs 'unsafe-inline' because Next.js App Router injects inline
 *   hydration/RSC scripts and next-themes injects an inline theme-setter script
 *   (the very thing preventing the dark-mode flash). A strict `script-src 'self'`
 *   would break hydration and re-introduce the flicker. Going stricter than this
 *   requires a per-request nonce via middleware.
 * - script-src adds 'unsafe-eval' in development only, for React Fast Refresh / HMR.
 * - style-src needs 'unsafe-inline' for Framer Motion's inline styles and Next's
 *   injected critical CSS.
 * - img-src allows the two configured remote image hosts plus data:/blob:
 *   (data: covers the inline SVG grain texture used in globals.css).
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://images.unsplash.com https://picsum.photos",
  "font-src 'self' data:",
  `connect-src 'self'${supabaseConnect ? ` ${supabaseConnect}` : ''}${isDev ? ' ws:' : ''}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  // Only upgrade in production — would otherwise upgrade ws://localhost HMR.
  ...(isDev ? [] : ['upgrade-insecure-requests']),
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default withBundleAnalyzer(
  withSentryConfig(nextConfig, {
  // Source-map upload settings — all read from env, no secrets committed.
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  // Quiet build output unless running in CI.
  silent: !process.env.CI,
  // Tree-shake Sentry's logger statements out of the client bundle.
  disableLogger: true,
  // Upload a wider set of client files for better stack traces.
  widenClientFileUpload: true,
  }),
);
