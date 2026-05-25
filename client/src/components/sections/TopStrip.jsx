// src/components/sections/TopStrip.jsx
//
// Тонкая красная полоса 3px поверх всего. Декоративная, не интерактивная.
// z-200 — выше Header (z-100), но ниже MobileMenu (z-1000).
import { motion, useReducedMotion } from 'motion/react'

// Длительность slide-in анимации полосы при первом mount App (1 сек).
const SLIDE_IN_DURATION = 1

/**
 * Декоративная красная полоса 3px фиксированная сверху страницы.
 *
 * При первом mount проигрывает slide-in: scaleX 0 → 1 с transformOrigin: left,
 * чтобы визуально полоса «вырастала» слева направо. SPA-навигация не пересоздаёт
 * App, поэтому анимация воспроизводится только при первой загрузке.
 */
function TopStrip() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 right-0 top-0 z-topstrip h-[3px] origin-left bg-red"
      initial={shouldReduceMotion ? false : { scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: SLIDE_IN_DURATION, ease: 'easeOut' }}
    />
  )
}

export default TopStrip
