// Пагинация каталога: «‹ 1 ... 4 5 6 ... 265 ›». Рендерится только при totalPages > 1 (CatalogPage).
// Текстовый минималистичный вид без рамок, под тёмный bg-navy фон секции.
import PropTypes from 'prop-types'

import { ChevronDown } from '@/components/ui/icons'
import { cn } from '@/utils/cn'

/**
 * Список номеров и «...»-разделителей для текущего диапазона.
 * Показываем: 1, currentPage-1, currentPage, currentPage+1, totalPages.
 * Между несмежными значениями вставляем «...».
 */
function getPageItems(currentPage, totalPages) {
  const candidates = new Set([1, currentPage - 1, currentPage, currentPage + 1, totalPages])
  const sorted = [...candidates].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b)

  const items = []
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      items.push({ kind: 'ellipsis', key: `e-${sorted[i - 1]}-${sorted[i]}` })
    }
    items.push({ kind: 'page', value: sorted[i], key: `p-${sorted[i]}` })
  }
  return items
}

/**
 * Пагинация по страницам каталога.
 *
 * @param {Object} props
 * @param {number} props.currentPage - Текущая страница (1-based).
 * @param {number} props.totalPages - Всего страниц (>1, проверка в родителе).
 * @param {(page: number) => void} props.onPageChange - Колбэк выбора страницы.
 * @param {string} [props.className] - Доп. классы корневого <nav>.
 */
export default function Pagination({ currentPage, totalPages, onPageChange, className }) {
  const items = getPageItems(currentPage, totalPages)

  const isFirst = currentPage <= 1
  const isLast = currentPage >= totalPages

  const handlePrev = () => {
    if (!isFirst) onPageChange(currentPage - 1)
  }
  const handleNext = () => {
    if (!isLast) onPageChange(currentPage + 1)
  }

  return (
    <nav
      aria-label="Страницы каталога"
      className={cn('flex items-center justify-center gap-2 font-sans text-[15px]', className)}
    >
      <button
        type="button"
        onClick={handlePrev}
        disabled={isFirst}
        aria-label="Предыдущая страница"
        className={cn(
          // h-11 min-w-11 (44px) — WCAG 2.5.5 touch-target.
          'grid h-11 min-w-11 place-items-center rounded-full transition-colors',
          isFirst
            ? 'cursor-default text-light/25'
            : 'cursor-pointer text-light/80 hover:bg-white/10 hover:text-white'
        )}
      >
        <ChevronDown size={18} className="rotate-90" />
      </button>

      {items.map((item) =>
        item.kind === 'ellipsis' ? (
          <span key={item.key} className="grid h-11 min-w-8 place-items-center text-slateHover">
            …
          </span>
        ) : (
          <button
            key={item.key}
            type="button"
            onClick={() => onPageChange(item.value)}
            aria-current={item.value === currentPage ? 'page' : undefined}
            className={cn(
              // h-11 min-w-11 (44px) — WCAG 2.5.5 touch-target.
              'grid h-11 min-w-11 cursor-pointer place-items-center rounded-full px-3 transition-colors',
              item.value === currentPage
                ? 'bg-red font-medium text-white'
                : 'text-light/80 hover:bg-white/10 hover:text-white'
            )}
          >
            {item.value}
          </button>
        )
      )}

      <button
        type="button"
        onClick={handleNext}
        disabled={isLast}
        aria-label="Следующая страница"
        className={cn(
          // h-11 min-w-11 (44px) — WCAG 2.5.5 touch-target.
          'grid h-11 min-w-11 place-items-center rounded-full transition-colors',
          isLast
            ? 'cursor-default text-light/25'
            : 'cursor-pointer text-light/80 hover:bg-white/10 hover:text-white'
        )}
      >
        <ChevronDown size={18} className="-rotate-90" />
      </button>
    </nav>
  )
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  className: PropTypes.string,
}
