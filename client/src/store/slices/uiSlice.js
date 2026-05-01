import { create } from 'zustand'

export const useUiStore = create((set) => ({
  isMenuOpen: false,
  setMenuOpen: (value) => set({ isMenuOpen: value }),
}))
