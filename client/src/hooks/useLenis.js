// Инициализирует глобальную плавную прокрутку через Lenis. Вызывается один раз в App.jsx.
// При prefers-reduced-motion: reduce — Lenis не инициализируется, используется нативный скролл.

import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * Подключает плавную прокрутку Lenis на всю страницу через RAF-цикл.
 * Нативные API (window.scrollY, useScroll из motion/react) продолжают работать корректно.
 */
export default function useLenis() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis()

    let rafId = 0
    const raf = (time) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])
}
