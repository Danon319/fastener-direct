import { useEffect, useRef, useState } from 'react'

/**
 * Хук отслеживания скролла страницы. Возвращает признаки положения и направления.
 *
 * @param {object} [options]
 * @param {number} [options.threshold=0]  Порог в пикселях. Свойство `isPastThreshold` истинно,
 *                                        если `window.scrollY` больше `threshold`.
 * @returns {{ isPastThreshold: boolean, direction: 'up' | 'down' | null }}
 *   isPastThreshold — true, когда window.scrollY больше порога threshold.
 *   direction — направление последнего скролла; null до первого движения.
 */
export default function useScrollDirection({ threshold = 0 } = {}) {
  const [state, setState] = useState(() => ({
    isPastThreshold: typeof window !== 'undefined' ? window.scrollY > threshold : false,
    direction: null,
  }))

  const prevScrollY = useRef(typeof window !== 'undefined' ? window.scrollY : 0)

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY
      const prev = prevScrollY.current

      const newDirection = current > prev ? 'down' : current < prev ? 'up' : null
      const newIsPastThreshold = current > threshold

      prevScrollY.current = current

      setState((s) => {
        const directionChanged = newDirection !== null && newDirection !== s.direction
        const thresholdChanged = newIsPastThreshold !== s.isPastThreshold
        if (!directionChanged && !thresholdChanged) return s
        return {
          isPastThreshold: newIsPastThreshold,
          direction: newDirection !== null ? newDirection : s.direction,
        }
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return state
}
