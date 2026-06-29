'use client';

// Route-segment error boundary for the App Router. Catches render/runtime
// errors below the root layout and reports them to Sentry.
import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="text-center p-8">
        <h2 className="text-2xl font-display text-fg mb-4">
          Something went wrong
        </h2>
        <p className="text-muted mb-6">Our projector had a hiccup.</p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-cobalt-500 text-white rounded-full font-semibold"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
