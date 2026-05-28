import { useEffect, useState } from 'react'

/**
 * Определяет, поддерживает ли устройство hover (наведение курсором). Возвращает два флага: canHover и isTouch.
 *
 * @returns {{ canHover: boolean, isTouch: boolean }}
 *   canHover — true, если устройство поддерживает наведение курсора (hover).
 *   isTouch — инверсия canHover; флаг для веток интерфейса на сенсорном вводе.
 */
export default function useViewport() {
  const [canHover, setCanHover] = useState(() => {
    if (typeof window === 'undefined') return true
    return window.matchMedia('(hover: hover)').matches
  })

  useEffect(() => {
    const mql = window.matchMedia('(hover: hover)')

    const handleChange = (e) => setCanHover(e.matches)
    mql.addEventListener('change', handleChange)

    return () => mql.removeEventListener('change', handleChange)
  }, [])

  return { canHover, isTouch: !canHover }
}
