import { QueryClient } from '@tanstack/react-query';

/**
 * Factory for a fresh QueryClient. A function (not a singleton) so the server
 * gets one client per request and the browser holds a single stable instance
 * via useState in QueryProvider.
 */
export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000, // 5 minutes
        retry: 2,
        refetchOnWindowFocus: false,
      },
    },
  });
}
