'use client';

// Top-level App Router error boundary. Reports React render errors to Sentry
// and renders a minimal fallback (must include its own <html>/<body>).
import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center',
          padding: '2rem',
        }}
      >
        <div style={{ maxWidth: '28rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>
            Something went wrong.
          </h2>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>
            Our projector had a hiccup. Please reload and try again.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '9999px',
              border: 'none',
              background: '#0B0F17',
              color: '#fff',
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            Reload the projector
          </button>
        </div>
      </body>
    </html>
  );
}
