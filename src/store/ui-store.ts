import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  quantity: number;
}

export type Locale = 'en' | 'ta' | 'hi';

export interface UIState {
  // --- state ---
  searchQuery: string;
  activeFilter: string;
  isCommandPaletteOpen: boolean;
  isChatOpen: boolean;
  locale: Locale;
  cartItems: CartItem[];

  // --- actions ---
  setSearchQuery: (q: string) => void;
  setActiveFilter: (f: string) => void;
  toggleCommandPalette: () => void;
  toggleChat: () => void;
  setLocale: (locale: Locale) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      searchQuery: '',
      activeFilter: 'all',
      isCommandPaletteOpen: false,
      isChatOpen: false,
      locale: 'en',
      cartItems: [],

      setSearchQuery: (q) => set({ searchQuery: q }),
      setActiveFilter: (f) => set({ activeFilter: f }),
      toggleCommandPalette: () =>
        set((s) => ({ isCommandPaletteOpen: !s.isCommandPaletteOpen })),
      toggleChat: () => set((s) => ({ isChatOpen: !s.isChatOpen })),
      setLocale: (locale) => set({ locale }),

      addToCart: (item) =>
        set((s) => {
          const existing = s.cartItems.find((i) => i.id === item.id);
          if (existing) {
            return {
              cartItems: s.cartItems.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i,
              ),
            };
          }
          return { cartItems: [...s.cartItems, item] };
        }),
      removeFromCart: (id) =>
        set((s) => ({ cartItems: s.cartItems.filter((i) => i.id !== id) })),
      clearCart: () => set({ cartItems: [] }),
    }),
    {
      name: 'nw-cart',
      storage: createJSONStorage(() => localStorage),
      // Persist the cart + language choice; other UI state resets each session.
      partialize: (state) => ({
        cartItems: state.cartItems,
        locale: state.locale,
      }),
    },
  ),
);

// --- selectors ---
export const selectSearchQuery = (state: UIState): string => state.searchQuery;
export const selectActiveFilter = (state: UIState): string => state.activeFilter;
export const selectCartCount = (state: UIState): number =>
  state.cartItems.reduce((total, item) => total + item.quantity, 0);
