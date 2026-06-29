'use client';

import { useEffect, useMemo, useState } from 'react';
import { filterProducts, type FilterableProduct } from '@/lib/performance';
import {
  selectActiveFilter,
  selectSearchQuery,
  useUIStore,
} from '@/store/ui-store';

/**
 * Filters a products array by the global search query + active filter from the
 * UI store.
 *
 * `queryOverride` is optional:
 * - Omitted: the hook debounces the store's search query by 300ms itself
 *   (no external lib) — the original Batch-2 behaviour.
 * - Provided (e.g. a useDeferredValue from the caller): that value is used
 *   directly and the internal debounce is skipped, since the caller owns the
 *   timing. This lets a component drive smoothing via React concurrent APIs.
 */
export function useProductFilter<T extends FilterableProduct>(
  products: T[],
  queryOverride?: string,
) {
  const storeQuery = useUIStore(selectSearchQuery);
  const activeFilter = useUIStore(selectActiveFilter);

  const [debouncedQuery, setDebouncedQuery] = useState(storeQuery);

  useEffect(() => {
    // Caller-controlled query owns its own timing — no internal debounce.
    if (queryOverride !== undefined) return;
    const id = setTimeout(() => setDebouncedQuery(storeQuery), 300);
    return () => clearTimeout(id);
  }, [storeQuery, queryOverride]);

  // `??` (not `||`) so an explicit empty-string query is respected.
  const effectiveQuery = queryOverride ?? debouncedQuery;

  const filteredProducts = useMemo(
    () => filterProducts(products, effectiveQuery, activeFilter),
    [products, effectiveQuery, activeFilter],
  );

  // True while the latest typed query hasn't yet propagated to the filter.
  const isFiltering = storeQuery !== effectiveQuery;

  return { filteredProducts, isFiltering };
}

export default useProductFilter;
