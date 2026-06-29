import { useQuery } from '@tanstack/react-query';
import { fetchWithRetry } from '@/lib/performance';

export type StockStatus = 'available' | 'limited' | 'on-request';

interface StockResponse {
  status: StockStatus;
  label: string;
  units: number;
}

export interface StockStatusResult {
  status: StockStatus;
  label: string;
  color: string;
  units: number;
  isLoading: boolean;
}

// Tailwind-friendly dot colors per status.
const STATUS_COLOR: Record<StockStatus, string> = {
  available: '#22c55e', // green
  limited: '#eab308', // yellow
  'on-request': '#9ca3af', // grey
};

async function fetchStock(productId: string): Promise<StockResponse> {
  // Exponential backoff: 1s → 2s → 4s between retries.
  // Prevents hammering server during brief network outages.
  return fetchWithRetry<StockResponse>(`/api/stock/${productId}`);
}

/**
 * Polls the (simulated) stock endpoint for a product every 30 seconds so the
 * badge updates live without a manual refresh.
 */
export function useStockStatus(productId: string): StockStatusResult {
  const { data, isLoading } = useQuery({
    queryKey: ['stock', productId],
    queryFn: () => fetchStock(productId),
    refetchInterval: 30_000, // poll every 30s
    staleTime: 20_000,
    refetchOnWindowFocus: false,
  });

  const status: StockStatus = data?.status ?? 'available';

  return {
    status,
    label: data?.label ?? 'In Stock',
    color: STATUS_COLOR[status],
    units: data?.units ?? 0,
    isLoading,
  };
}
