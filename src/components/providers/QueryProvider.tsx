'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useState, type ReactNode } from 'react';
import { makeQueryClient } from '@/lib/query-client';

// Devtools are code-split and never server-rendered. Because we only mount the
// component when NODE_ENV === 'development', the dynamic import's chunk is never
// requested in production builds.
const ReactQueryDevtools = dynamic(
  () =>
    import('@tanstack/react-query-devtools').then((mod) => ({
      default: mod.ReactQueryDevtools,
    })),
  { ssr: false },
);

export default function QueryProvider({ children }: { children: ReactNode }) {
  // useState initializer runs once per mount, so the client is not recreated
  // on every render.
  const [queryClient] = useState(() => makeQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
