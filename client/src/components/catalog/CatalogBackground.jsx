// Декоративный фон страницы каталога: фиксированный во всю высоту вьюпорта,
// светлая заливка + вертикальные колоночные линии (паттерн как в OurValuesSection).
// Не скроллится с контентом, лежит за всеми остальными слоями (z-0).
import { useEffect, useState } from 'react'

const DESKTOP_COLUMNS = 15
const MOBILE_COLUMNS = 6
const LINE_COLOR = '#d1d1d1'

// Локальный matchMedia-helper (узкий случай для одного компонента, см. прецедент в Hero/OurValues).
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined') return true
    return window.matchMedia('(min-width: 1024px)').matches
  })
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const handler = (e) => setIsDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isDesktop
}

/**
 * Фиксированный фон страницы каталога с вертикальными колоночными линиями.
 *
 * Цвет фона совпадает с OurValuesSection (#E4E8EC = tagDate). Декоративный, не интерактивный.
 */
export default function CatalogBackground() {
  const isDesktop = useIsDesktop()
  const columns = isDesktop ? DESKTOP_COLUMNS : MOBILE_COLUMNS

  const lines = []
  for (let i = 1; i < columns; i++) {
    lines.push(
      <div
        key={i}
        className="absolute bottom-0 top-0"
        style={{
          left: `${(i / columns) * 100}%`,
          width: '1px',
          backgroundColor: LINE_COLOR,
        }}
      />
    )
  }

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 bg-tagDate">
      {lines}
    </div>
  )
}
