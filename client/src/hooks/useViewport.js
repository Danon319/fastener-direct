import { useEffect, useState } from 'react'

/**
 * Хук определения возможностей устройства, которые недоступны через CSS media queries Tailwind.
 *
 * Адаптив (mobile-first sm/md/lg/xl/2xl) управляется Tailwind-классами.
 * Хук отдаёт только поведенческие сигналы: поддержка hover и её инверсия.
 *
 * @returns {{ canHover: boolean, isTouch: boolean }}
 *   canHover - true если устройство поддерживает hover (десктоп с мышью).
 *   isTouch  - инверсия canHover; флаг для touch-ветвей интерфейса.
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
