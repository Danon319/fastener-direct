import { useReducedMotion } from 'motion/react'

import { ENTRANCE_DURATION, ENTRANCE_EASE, ENTRANCE_STAGGER, ENTRANCE_Y } from '@/config/entrance'

/**
 * Канон entrance-анимации (fade + сдвиг снизу) как фабрика motion-пропсов.
 *
 * Возвращает функцию `(index) => props` для `<motion.*>`. Инкапсулирует
 * reduced-motion guard и два паттерна триггера:
 *  - `'mount'`  — анимация играет при монтировании (элемент уже в viewport);
 *  - `'inView'` — анимация играет при попадании в viewport (`whileInView`, once).
 *
 * @param {Object} [options]
 * @param {'mount' | 'inView'} [options.trigger='mount'] - Когда запускать анимацию.
 * @param {number} [options.baseDelay=0] - Базовая задержка перед stagger (сек).
 * @param {boolean} [options.shift=true] - Со сдвигом снизу (`true`) или только opacity (`false`).
 * @returns {(index?: number) => Object} - Фабрика props для motion-элемента.
 */
export default function useEntranceProps({ trigger = 'mount', baseDelay = 0, shift = true } = {}) {
  const shouldReduceMotion = useReducedMotion()

  return (index = 0) => {
    if (shouldReduceMotion) {
      return { initial: false }
    }

    const transition = {
      duration: ENTRANCE_DURATION,
      delay: baseDelay + index * ENTRANCE_STAGGER,
      ease: ENTRANCE_EASE,
    }
    const from = shift ? { opacity: 0, y: ENTRANCE_Y } : { opacity: 0 }
    const to = shift ? { opacity: 1, y: 0 } : { opacity: 1 }

    if (trigger === 'inView') {
      return {
        initial: from,
        whileInView: to,
        viewport: { once: true, amount: 0.3 },
        transition,
      }
    }

    return {
      initial: from,
      animate: to,
      transition,
    }
  }
}
