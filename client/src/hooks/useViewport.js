import { useEffect, useState } from 'react'

/**
 * Хук определения возможностей устройства, которые не выразить медиазапросами Tailwind в CSS.
 *
 * Адаптив (mobile-first, контрольные точки sm/md/lg/xl/2xl) задаётся классами Tailwind.
 * Хук отдаёт только поведенческие сигналы: поддержка наведения курсора и её инверсия.
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
