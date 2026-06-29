'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Optional custom fallback to render instead of the default screen. */
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * React error boundary. Must be a class component — error boundaries rely on
 * getDerivedStateFromError / componentDidCatch, which have no hook equivalent.
 */
export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Surface in dev; in production this is captured by Sentry's global handlers.
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('ErrorBoundary caught an error:', error, info);
    }
  }

  private handleRetry = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="bg-surface text-fg flex min-h-[60vh] w-full flex-col items-center justify-center px-6 py-24 text-center">
          <div className="border-soft bg-elev mx-auto flex max-w-md flex-col items-center gap-5 rounded-2xl border p-10">
            <span className="eyebrow text-muted">Error 500</span>
            <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              Something went wrong.
            </h2>
            <p className="text-muted text-base leading-relaxed">
              Our projector had a hiccup. Give the reel a moment, then try again.
            </p>
            <button
              type="button"
              onClick={this.handleRetry}
              className="bg-fg text-surface mt-2 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              Reload the projector
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
