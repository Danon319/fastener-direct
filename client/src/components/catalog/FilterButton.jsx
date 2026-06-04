// Кнопка «Фильтры» с поповер-панелью всех фасетов (Бренд / Цена / Наличие).
// Значения — черновик (staged); «Показать» = applyStaged, «Сбросить» = resetStaged.
// Панель синхронизирует staged ← applied при открытии (через onSyncStaged на mount).
import { useEffect } from 'react'
import PropTypes from 'prop-types'

import { Filter, ChevronDown, Close, Check } from '@/components/ui/icons'
import { BRANDS } from '@/content/catalog'
import { cn } from '@/utils/cn'

import ToolbarMenu from './ToolbarMenu'

// Быстрые диапазоны цены — заполняют поля «от/до».
const PRICE_RANGES = [
  { label: 'до 10 ₽', min: '', max: '10' },
  { label: '10–50 ₽', min: '10', max: '50' },
  { label: '50–200 ₽', min: '50', max: '200' },
  { label: 'от 200 ₽', min: '200', max: '' },
]

// Кастомный чекбокс в стиле дизайна.
function CheckBox({ checked }) {
  return (
    <span
      className={cn(
        'flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border transition-colors',
        checked ? 'border-red bg-red text-white' : 'border-slateHover/50 bg-white'
      )}
    >
      {checked && <Check size={12} />}
    </span>
  )
}

CheckBox.propTypes = { checked: PropTypes.bool }

// Секция панели фильтров.
function FilterSection({ title, last = false, children }) {
  return (
    <div className={cn('px-4 py-3.5', !last && 'border-b border-divider')}>
      <span className="mb-2.5 block text-[12px] font-medium uppercase tracking-wider text-muted">
        {title}
      </span>
      {children}
    </div>
  )
}

FilterSection.propTypes = {
  title: PropTypes.string.isRequired,
  last: PropTypes.bool,
  children: PropTypes.node,
}

// Список чекбоксов брендов (бренды — строки).
function BrandList({ selected, onToggle }) {
  return (
    <div className="flex max-h-72 flex-col gap-0.5 overflow-y-auto pr-1">
      {BRANDS.map((brand) => {
        const isOn = selected.includes(brand)
        return (
          <label
            key={brand}
            className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 transition-colors hover:bg-light"
          >
            <CheckBox checked={isOn} />
            <span className="text-[13.5px] text-navy">{brand}</span>
            <input
              type="checkbox"
              checked={isOn}
              onChange={() => onToggle(brand)}
              className="sr-only"
            />
          </label>
        )
      })}
    </div>
  )
}

BrandList.propTypes = {
  selected: PropTypes.arrayOf(PropTypes.string).isRequired,
  onToggle: PropTypes.func.isRequired,
}

// Цена: поля «от/до» + быстрые диапазоны.
function PriceFilter({ min, max, onMin, onMax }) {
  const inputClass =
    'h-10 w-full rounded-lg border border-divider bg-white px-3 text-[13.5px] text-navy outline-none transition-colors placeholder:text-muted focus:border-slate'
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <input
          type="number"
          placeholder="от"
          value={min}
          min={0}
          onChange={(e) => onMin(e.target.value)}
          className={inputClass}
        />
        <span className="shrink-0 text-muted">—</span>
        <input
          type="number"
          placeholder="до"
          value={max}
          min={0}
          onChange={(e) => onMax(e.target.value)}
          className={inputClass}
        />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {PRICE_RANGES.map((r) => {
          const isOn = r.min === min && r.max === max
          return (
            <button
              key={r.label}
              type="button"
              onClick={() => {
                onMin(r.min)
                onMax(r.max)
              }}
              className={cn(
                'rounded-full px-3 py-1.5 text-[12px] transition-colors',
                isOn ? 'bg-red text-white' : 'bg-light text-navy/80 hover:bg-tagDate'
              )}
            >
              {r.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

PriceFilter.propTypes = {
  min: PropTypes.string.isRequired,
  max: PropTypes.string.isRequired,
  onMin: PropTypes.func.isRequired,
  onMax: PropTypes.func.isRequired,
}

// Тумблер «В наличии». Трек всегда белый; при включении краснеют только обводка и бегунок.
function StockToggle({ checked, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex h-10 items-center gap-2.5 whitespace-nowrap rounded-full border border-divider bg-white pl-2 pr-4 text-[13px] font-medium text-navy/80 transition-colors hover:border-slateHover"
    >
      <span
        className={cn(
          'relative h-6 w-10 rounded-full border bg-white transition-colors',
          checked ? 'border-red' : 'border-slateHover/40'
        )}
      >
        <span
          className={cn(
            'absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full shadow transition-all',
            checked ? 'left-[18px] bg-red' : 'left-0.5 bg-slateHover'
          )}
        />
      </span>
      В наличии
    </button>
  )
}

StockToggle.propTypes = {
  checked: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
}

/**
 * Содержимое поповера. При монтировании (т.е. при открытии) копирует applied → staged.
 */
function FilterPanel({
  stagedBrands,
  stagedPriceMin,
  stagedPriceMax,
  stagedInStockOnly,
  onToggleBrand,
  onPriceMinChange,
  onPriceMaxChange,
  onInStockToggle,
  onSyncStaged,
  onApply,
  onReset,
  close,
}) {
  // Открыли панель — показываем актуальные применённые фильтры как черновик.
  useEffect(() => {
    onSyncStaged()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-[0_8px_28px_rgba(0,0,0,0.18)] ring-1 ring-black/5">
      <div className="flex h-12 items-center justify-between gap-3 border-b border-divider px-4">
        <span className="inline-flex items-center gap-2 text-[13.5px] font-medium text-navy">
          <Filter size={16} className="text-muted" />
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

      <div className="max-h-[60vh] overflow-y-auto">
        <FilterSection title="Бренд">
          <BrandList selected={stagedBrands} onToggle={onToggleBrand} />
        </FilterSection>
        <FilterSection title="Цена">
          <PriceFilter
            min={stagedPriceMin}
            max={stagedPriceMax}
            onMin={onPriceMinChange}
            onMax={onPriceMaxChange}
          />
        </FilterSection>
        <FilterSection title="Наличие" last>
          <StockToggle checked={stagedInStockOnly} onToggle={onInStockToggle} />
        </FilterSection>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-divider px-4 py-3">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[13px] font-medium text-muted transition-colors hover:text-red"
        >
          <Close size={14} /> Сбросить
        </button>
        <button
          type="button"
          onClick={() => {
            onApply()
            close()
          }}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-red px-5 text-[13px] font-medium text-white transition-colors hover:bg-redHover"
        >
          Показать результаты
        </button>
      </div>
    </div>
  )
}

FilterPanel.propTypes = {
  stagedBrands: PropTypes.arrayOf(PropTypes.string).isRequired,
  stagedPriceMin: PropTypes.string.isRequired,
  stagedPriceMax: PropTypes.string.isRequired,
  stagedInStockOnly: PropTypes.bool.isRequired,
  onToggleBrand: PropTypes.func.isRequired,
  onPriceMinChange: PropTypes.func.isRequired,
  onPriceMaxChange: PropTypes.func.isRequired,
  onInStockToggle: PropTypes.func.isRequired,
  onSyncStaged: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
}

/**
 * Кнопка «Фильтры» в тулбаре с поповер-панелью фасетов.
 *
 * @param {Object} props
 * @param {string[]} props.stagedBrands
 * @param {string} props.stagedPriceMin
 * @param {string} props.stagedPriceMax
 * @param {boolean} props.stagedInStockOnly
 * @param {(brand: string) => void} props.onToggleBrand
 * @param {(v: string) => void} props.onPriceMinChange
 * @param {(v: string) => void} props.onPriceMaxChange
 * @param {() => void} props.onInStockToggle
 * @param {() => void} props.onSyncStaged - Копирует applied → staged (вызывается при открытии).
 * @param {() => void} props.onApply - applyStaged.
 * @param {() => void} props.onReset - resetStaged.
 */
export default function FilterButton(panelProps) {
  return (
    <ToolbarMenu
      align="left"
      panelClassName="w-[min(440px,92vw)]"
      renderTrigger={({ open, toggle }) => (
        <button
          type="button"
          onClick={toggle}
          className={cn(
            'inline-flex h-12 items-center gap-2.5 rounded-full px-4 text-[13px] font-medium text-light transition-colors',
            open ? 'bg-navy' : 'bg-slate hover:bg-navy'
          )}
        >
          <Filter size={16} />
          Фильтры
          <ChevronDown
            size={14}
            className={cn('transition-transform duration-200', open && 'rotate-180')}
          />
        </button>
      )}
    >
      {(close) => <FilterPanel close={close} {...panelProps} />}
    </ToolbarMenu>
  )
}

FilterButton.propTypes = {
  stagedBrands: PropTypes.arrayOf(PropTypes.string).isRequired,
  stagedPriceMin: PropTypes.string.isRequired,
  stagedPriceMax: PropTypes.string.isRequired,
  stagedInStockOnly: PropTypes.bool.isRequired,
  onToggleBrand: PropTypes.func.isRequired,
  onPriceMinChange: PropTypes.func.isRequired,
  onPriceMaxChange: PropTypes.func.isRequired,
  onInStockToggle: PropTypes.func.isRequired,
  onSyncStaged: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
}
