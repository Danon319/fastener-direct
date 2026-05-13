import { create } from 'zustand'

export const useCartStore = create((set, get) => ({
  // productId → количество
  items: new Map(),

  addToCart: (productId, quantity = 1) =>
    set((state) => {
      const next = new Map(state.items)
      next.set(productId, quantity)
      return { items: next }
    }),

  removeFromCart: (productId) =>
    set((state) => {
      const next = new Map(state.items)
      next.delete(productId)
      return { items: next }
    }),

  updateQuantity: (productId, quantity) =>
    set((state) => {
      const next = new Map(state.items)
      if (next.has(productId)) {
        next.set(productId, Math.max(1, quantity))
      }
      return { items: next }
    }),

  isInCart: (productId) => get().items.has(productId),

  getQuantity: (productId) => get().items.get(productId) || 0,

  getCartCount: () => get().items.size,
}))
