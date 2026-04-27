import { useEffect, useState } from 'react'

/**
 * Хук определения возможностей устройства, которые недоступны через CSS media queries Tailwind.
 *
 * Adaptive layout (mobile-first sm/md/lg/xl/2xl) is handled by Tailwind classes.
 * This hook only exposes behavioral signals: hover capability and its inverse.
 *
 * @returns {{ canHover: boolean, isTouch: boolean }}
 *   canHover - true if the primary input device supports hover (desktop with mouse).
 *   isTouch  - inverse of canHover; convenience flag for touch-driven UI branches.
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
