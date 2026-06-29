// Sentry browser SDK init — runs on the client.
// Loaded & injected into the client bundle by withSentryConfig (Sentry plugin).
// DSN is supplied via env only; never hard-code the key here.
import * as Sentry from '@sentry/nextjs';

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn,
  // Disable until a real DSN is provided so dev/build stay quiet and no-op.
  enabled: Boolean(dsn),
  // Adjust in production to control performance-tracing volume.
  tracesSampleRate: 1,
  // Session Replay (off by default — opt in by raising these rates).
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,
  debug: false,
});
