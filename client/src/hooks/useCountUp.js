import { useEffect, useRef, useState } from 'react'

/**
 * Анимирует число от 0 до `end` за `duration` мс по кубической кривой ease-out (замедление к концу).
 *
 * Анимация запускается только когда `start === true`. До этого момента
 * хук возвращает 0. Это позволяет запускать отсчёт, например, при
 * попадании элемента в область видимости экрана.
 *
 * @param {number} end       Целевое число.
 * @param {number} duration  Длительность анимации в мс.
 * @param {boolean} start    Когда true — анимация запускается с текущего момента.
 * @returns {number}         Текущее значение счётчика (целое).
 */
export default function useCountUp(end, duration, start) {
  const [value, setValue] = useState(0)
  const rafRef = useRef(null)

  useEffect(() => {
    if (!start) return

    let t0 = null

    const tick = (ts) => {
      if (t0 === null) t0 = ts
      const p = Math.min((ts - t0) / duration, 1)
      const e = 1 - Math.pow(1 - p, 3)
      setValue(Math.floor(e * end))
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [start, end, duration])

  return start ? value : 0
}
