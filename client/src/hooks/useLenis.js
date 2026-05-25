// src/hooks/useLenis.js
//
// Глобальная плавная прокрутка через библиотеку Lenis.
// Хук вызывается один раз на верхнем уровне (App.jsx).
// При prefers-reduced-motion: reduce — Lenis не инициализируется и страница
// использует нативный мгновенный скролл.
//
// Lenis перехватывает wheel/touch события и интерполирует скролл через RAF,
// нативные API (window.scrollY, useScroll из motion/react, scroll-listeners
// на window) продолжают работать корректно.

import { useEffect } from 'react'
import Lenis from 'lenis'

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
