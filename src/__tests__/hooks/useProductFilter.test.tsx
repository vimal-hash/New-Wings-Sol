import { renderHook } from '@testing-library/react';
import { PRODUCTS } from '@/lib/data';
import { useProductFilter } from '@/hooks/useProductFilter';
import { useUIStore } from '@/store/ui-store';

// Mock the store but keep the real selector functions, so the hook's
// `useUIStore(selectSearchQuery)` calls resolve against our fake state.
jest.mock('@/store/ui-store', () => {
  const actual = jest.requireActual('@/store/ui-store');
  return { __esModule: true, ...actual, useUIStore: jest.fn() };
});

const mockedUseUIStore = useUIStore as unknown as jest.Mock;

function mockState(state: { searchQuery: string; activeFilter: string }) {
  mockedUseUIStore.mockImplementation((selector: (s: unknown) => unknown) =>
    selector(state),
  );
}

describe('useProductFilter', () => {
  afterEach(() => jest.clearAllMocks());

  it('returns all products when no search and filter is "all"', () => {
    mockState({ searchQuery: '', activeFilter: 'all' });
    const { result } = renderHook(() => useProductFilter(PRODUCTS));
    expect(result.current.filteredProducts).toHaveLength(PRODUCTS.length);
  });

  it('filters by accent', () => {
    mockState({ searchQuery: '', activeFilter: 'coral' });
    const { result } = renderHook(() => useProductFilter(PRODUCTS));
    const filtered = result.current.filteredProducts;
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every((p) => p.accent === 'coral')).toBe(true);
  });

  it('filters by name via the search query', () => {
    mockState({ searchQuery: 'galalite', activeFilter: 'all' });
    const { result } = renderHook(() => useProductFilter(PRODUCTS));
    const filtered = result.current.filteredProducts;
    expect(filtered).toHaveLength(1);
    expect(filtered[0].name.toLowerCase()).toContain('galalite');
  });
});
