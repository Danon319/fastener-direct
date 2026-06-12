// Дропдаун сортировки в тулбаре. Опции совпадают с switch в useCatalogFilters.
// activeSort === null — порядок по умолчанию (как в исходном PRODUCTS).
import PropTypes from 'prop-types'

import { Sort, ChevronDown, Check, Close } from '@/components/ui/icons'
import { cn } from '@/utils/cn'

import ToolbarMenu from './ToolbarMenu'

// key === null соответствует «без сортировки» (activeSort = null в хуке).
const SORT_OPTIONS = [
  { key: null, label: 'По умолчанию' },
  { key: 'price-asc', label: 'Сначала дешевле' },
  { key: 'price-desc', label: 'Сначала дороже' },
  { key: 'name-asc', label: 'По названию (А–Я)' },
  { key: 'in-stock', label: 'Сначала в наличии' },
]

/**
 * Дропдаун выбора сортировки каталога.
 *
 * @param {Object} props
 * @param {string|null} props.value - Текущий ключ сортировки (null = по умолчанию).
 * @param {(key: string|null) => void} props.onChange - Сменить сортировку.
 */
export default function SortDropdown({ value, onChange }) {
  const current = SORT_OPTIONS.find((s) => s.key === value) ?? SORT_OPTIONS[0]

  return (
    <ToolbarMenu
      align="right"
      panelClassName="w-64"
      renderTrigger={({ open, toggle }) => (
        <button
          type="button"
          onClick={toggle}
          className="inline-flex h-12 items-center gap-2 whitespace-nowrap rounded-full border border-pillHover bg-white pl-3.5 pr-3 text-[13px] font-medium text-navy/90 transition-colors hover:bg-pillHover"
        >
          <Sort size={15} className="text-muted" />
          <span className="hidden font-normal text-muted sm:inline">Сортировка:</span>
          <span>{current.label}</span>
          <ChevronDown
            size={13}
            className={cn('text-muted transition-transform duration-200', open && 'rotate-180')}
          />
        </button>
      )}
    >
      {(close) => (
        <div className="overflow-hidden rounded-2xl bg-white shadow-popover ring-1 ring-black/5">
          <div className="flex h-12 items-center justify-between gap-3 border-b border-divider px-4">
            <span className="inline-flex items-center gap-2 text-[13.5px] font-medium text-navy">
              <Sort size={16} className="text-muted" />
            </span>
            <button
              type="button"
              onClick={close}
              aria-label="Закрыть"
              className="grid h-7 w-7 place-items-center rounded-full text-muted transition-colors hover:bg-light hover:text-navy"
            >
              <Close size={15} />
            </button>
          </div>
          <div className="px-1.5 pb-1.5 pt-1.5">
            {SORT_OPTIONS.map((opt) => {
              const isActive = opt.key === value
              return (
                <button
                  key={opt.key ?? 'default'}
                  type="button"
                  onClick={() => {
                    onChange(opt.key)
                    close()
                  }}
                  className={cn(
                    'flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-[13.5px] transition-colors',
                    isActive ? 'bg-light font-medium text-navy' : 'text-navy/80 hover:bg-light'
                  )}
                >
                  {opt.label}
                  {isActive && <Check size={15} className="text-red" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </ToolbarMenu>
  )
}

SortDropdown.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
}
