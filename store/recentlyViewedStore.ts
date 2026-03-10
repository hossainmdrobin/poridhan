import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const MAX_RECENT = 10;

interface RecentProduct {
  productId: string;
  name: string;
  price: number;
  discountPrice?: number;
  image?: string;
}

interface RecentlyViewedState {
  items: RecentProduct[];
  addItem: (item: RecentProduct) => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const filtered = state.items.filter((i) => i.productId !== item.productId);
          const updated = [item, ...filtered].slice(0, MAX_RECENT);
          return { items: updated };
        }),
    }),
    { name: 'recently-viewed-storage' }
  )
);
