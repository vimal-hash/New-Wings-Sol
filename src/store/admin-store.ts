import { create } from 'zustand';

export interface AdminState {
  // --- state ---
  featuredProductOrder: string[];
  pendingQuotes: number;
  isAdminSidebarOpen: boolean;

  // --- actions ---
  setFeaturedOrder: (order: string[]) => void;
  setPendingQuotes: (count: number) => void;
  toggleAdminSidebar: () => void;
}

export const useAdminStore = create<AdminState>()((set) => ({
  featuredProductOrder: [],
  pendingQuotes: 0,
  isAdminSidebarOpen: true,

  setFeaturedOrder: (order) => set({ featuredProductOrder: order }),
  setPendingQuotes: (count) => set({ pendingQuotes: count }),
  toggleAdminSidebar: () =>
    set((s) => ({ isAdminSidebarOpen: !s.isAdminSidebarOpen })),
}));
