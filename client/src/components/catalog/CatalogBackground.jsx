// Декоративный фон страницы каталога: фиксированный во всю высоту вьюпорта,
// светлая заливка + вертикальные колоночные линии (паттерн как в OurValuesSection).
// Не скроллится с контентом, лежит за всеми остальными слоями (z-0).
import { GridLines } from '@/components/ui'
import { useBreakpoint } from '@/hooks'

const DESKTOP_COLUMNS = 15
const MOBILE_COLUMNS = 6

/**
 * Фиксированный фон страницы каталога с вертикальными колоночными линиями.
 *
 * Цвет фона совпадает с OurValuesSection (#E4E8EC = tagDate). Декоративный, не интерактивный.
 */
export default function CatalogBackground() {
  const isDesktop = useBreakpoint('lg', true)
  const columns = isDesktop ? DESKTOP_COLUMNS : MOBILE_COLUMNS

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 bg-tagDate">
      <GridLines columns={columns} />
    </div>
  )
}
