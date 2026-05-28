// Zustand-слайс UI состояния. isMenuOpen — Header пишет, MobileMenu читает.

import { create } from 'zustand'

export const useUiStore = create((set) => ({
  isMenuOpen: false,
  setMenuOpen: (value) => set({ isMenuOpen: value }),
}))
