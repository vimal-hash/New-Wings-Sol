import { render, screen } from '@testing-library/react';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

function Boom(): never {
  throw new Error('boom');
}

describe('ErrorBoundary', () => {
  it('renders children normally when nothing throws', () => {
    render(
      <ErrorBoundary>
        <p>safe content</p>
      </ErrorBoundary>,
    );
    expect(screen.getByText('safe content')).toBeInTheDocument();
  });

  it('renders the fallback when a child throws', () => {
    // React logs the caught error to console.error — silence it for a clean run.
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    spy.mockRestore();
  });

  it('renders a custom fallback when provided', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary fallback={<div>custom fallback</div>}>
        <Boom />
      </ErrorBoundary>,
    );

    expect(screen.getByText('custom fallback')).toBeInTheDocument();
    spy.mockRestore();
  });
});
