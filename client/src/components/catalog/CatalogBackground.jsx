// Декоративный фон каталога: фиксированный bg-tagDate + вертикальные колоночные линии (z-0).
// Не скроллится с контентом, используется GridLines как в OurValuesSection.
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
