// Zustand-слайс избранного. Хранит Set<productId>.

import { create } from 'zustand'

export const useFavoritesStore = create((set, get) => ({
  items: new Set(),

  toggleItem: (id) =>
    set((state) => {
      const next = new Set(state.items)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return { items: next }
    }),

  hasItem: (id) => get().items.has(id),

  count: () => get().items.size,
}))
