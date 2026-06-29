// Pure, hook-free utilities. Safe to import in both server and client code.

/** Minimal shape required to filter a product. */
export interface FilterableProduct {
  name: string;
  description: string;
  accent: string;
}

/**
 * Pure product filter. Used inside useProductFilter with useMemo.
 * - filter === 'all' matches every accent.
 * - query matches name or description, case-insensitive.
 */
export function filterProducts<T extends FilterableProduct>(
  products: T[],
  query: string,
  filter: string,
): T[] {
  const q = query.trim().toLowerCase();

  return products.filter((product) => {
    const matchesFilter = filter === 'all' || product.accent === filter;
    if (!matchesFilter) return false;
    if (!q) return true;

    return (
      product.name.toLowerCase().includes(q) ||
      product.description.toLowerCase().includes(q)
    );
  });
}

/**
 * fetch() + JSON parse with exponential-backoff retries.
 * attempt 0: wait 1s, attempt 1: wait 2s, attempt 2: wait 4s.
 * Prevents hammering the server during brief network outages.
 */
export async function fetchWithRetry<T>(
  url: string,
  options?: RequestInit,
  maxRetries = 3,
): Promise<T> {
  let lastError: Error = new Error('Unknown error');
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      return (await response.json()) as T;
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError;
}

// Reuse one formatter instance — constructing Intl.NumberFormat is expensive.
const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

/**
 * Indian-format currency. formatPrice(1500000) → '₹15,00,000'.
 */
export function formatPrice(amount: number): string {
  return inrFormatter.format(amount);
}

/**
 * Standard trailing-edge debounce. The returned function is fire-and-forget,
 * so it returns void — a debounced call cannot synchronously return fn's value.
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | undefined;

  return (...args: Parameters<T>): void => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
