// Sentry Node SDK init — runs on the server runtime.
// DSN is supplied via env only; never hard-code the key here.
import * as Sentry from '@sentry/nextjs';

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn,
  enabled: Boolean(dsn),
  tracesSampleRate: 1,
  debug: false,
});
