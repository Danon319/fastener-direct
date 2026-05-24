// Выезжающая слева панель: сортировка, цена, бренд, наличие. Значения — черновик (staged);
// родитель копирует их в applied по «Применить». Затемнение кликом и Escape закрывают без apply.
import { useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { motion } from 'motion/react'

import { Checkbox } from '@/components/ui'
import { Close } from '@/components/ui/icons'
import FilterAccordion from './FilterAccordion'
import { BRANDS } from '@/content/catalog'
import { cn } from '@/utils/cn'

/** Ключи сортировки совпадают с switch в CatalogPage (filtered useMemo). */
const SORT_OPTIONS = [
  { key: 'price-asc', label: 'По цене (возрастание) \u2191' },
  { key: 'price-desc', label: 'По цене (убывание) \u2193' },
  { key: 'name-asc', label: 'По названию (А\u2013Я)' },
  { key: 'in-stock', label: 'По наличию' },
]

/** Радиогруппа: повторный клик по активной опции снимает сортировку (null). */
function SortSection({ activeSort, onSortChange }) {
  return (
    <div className="border-b border-light pb-4">
      <p className="mb-2 font-sans text-sm font-medium text-navy">Сортировка</p>
      <div className="flex flex-col gap-1">
        {SORT_OPTIONS.map((opt) => (
          <label key={opt.key} className="flex cursor-pointer items-center gap-2.5 py-1.5">
            <span
              className={cn(
                'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors',
                activeSort === opt.key ? 'border-red' : 'border-slate/30'
              )}
              aria-hidden="true"
            >
              {activeSort === opt.key && <span className="block h-2 w-2 rounded-full bg-red" />}
            </span>
            <input
              type="radio"
              name="sort"
              value={opt.key}
              checked={activeSort === opt.key}
              onChange={() => onSortChange(activeSort === opt.key ? null : opt.key)}
              className="sr-only"
            />
            <span className="font-sans text-sm text-navy">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

SortSection.propTypes = {
  activeSort: PropTypes.string,
  onSortChange: PropTypes.func.isRequired,
}

/** Два числовых поля «от / до»; значения строками до parseFloat на стороне страницы. */
function PriceFilter({ priceMin, priceMax, onPriceMinChange, onPriceMaxChange }) {
  return (
    <div>
      <p className="mb-2 font-sans text-sm font-medium text-navy">Цена</p>
      <div className="flex items-center gap-2">
        <input
          type="number"
          placeholder="от"
          value={priceMin}
          onChange={(e) => onPriceMinChange(e.target.value)}
          min={0}
          className="h-9 w-full rounded-lg border border-light bg-white px-3 font-sans text-sm text-navy outline-none transition-colors placeholder:text-muted focus:border-slate"
        />
        <span className="shrink-0 text-muted">—</span>
        <input
          type="number"
          placeholder="до"
          value={priceMax}
          onChange={(e) => onPriceMaxChange(e.target.value)}
          min={0}
          className="h-9 w-full rounded-lg border border-light bg-white px-3 font-sans text-sm text-navy outline-none transition-colors placeholder:text-muted focus:border-slate"
        />
      </div>
    </div>
  )
}

PriceFilter.propTypes = {
  priceMin: PropTypes.string.isRequired,
  priceMax: PropTypes.string.isRequired,
  onPriceMinChange: PropTypes.func.isRequired,
  onPriceMaxChange: PropTypes.func.isRequired,
}

export default function FilterSidebar({
  activeSort,
  onSortChange,
  stagedBrands,
  stagedPriceMin,
  stagedPriceMax,
  stagedInStockOnly,
  onToggleBrand,
  onPriceMinChange,
  onPriceMaxChange,
  onInStockToggle,
  onApply,
  onReset,
  onClose,
  activeFilterCount,
}) {
  // Пока панель открыта — не скроллить документ под ней.
  useEffect(() => {
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = 'hidden'
    return () => {
      html.style.overflow = prev
    }
  }, [])

  // Закрытие по Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Сначала зафиксировать фильтры на странице, затем закрыть панель.
  const handleApply = useCallback(() => {
    onApply()
    onClose()
  }, [onApply, onClose])

  return (
    <>
      {/* Затемнение фона */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-filterBackdrop bg-black/40"
        onClick={onClose}
      />

      {/* Панель фильтров */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        className="fixed inset-y-0 left-0 z-filterPanel flex w-[85vw] max-w-xs flex-col bg-white font-sans shadow-xl"
      >
        {/* Шапка */}
        <div className="flex items-center justify-between border-b border-light px-5 py-4">
          <h2 className="text-lg font-medium text-navy">Фильтры</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть фильтры"
            className="flex items-center justify-center rounded-full p-1 text-navy transition-colors hover:bg-light"
          >
            <Close size={22} />
          </button>
        </div>

        {/* Прокручиваемое содержимое */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="flex flex-col gap-4">
            {/* Сортировка */}
            <SortSection activeSort={activeSort} onSortChange={onSortChange} />

            {/* Цена */}
            <PriceFilter
              priceMin={stagedPriceMin}
              priceMax={stagedPriceMax}
              onPriceMinChange={onPriceMinChange}
              onPriceMaxChange={onPriceMaxChange}
            />

            {/* Бренд */}
            <FilterAccordion
              title="Бренд"
              items={BRANDS}
              selected={stagedBrands}
              onToggle={onToggleBrand}
            />

            {/* Наличие */}
            <div className="border-t border-light pt-3">
              <p className="mb-1 font-sans text-sm font-medium text-navy">Наличие</p>
              <Checkbox
                checked={stagedInStockOnly}
                onChange={onInStockToggle}
                label="Только в наличии"
              />
            </div>
          </div>
        </div>

        {/* Подвал */}
        <div className="border-t border-light px-5 py-4">
          <div className="mb-3 text-center text-sm text-muted">
            Выбрано фильтров: {activeFilterCount}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onReset}
              className="flex-1 rounded-lg border border-light px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:border-slate hover:text-navy"
            >
              Сбросить
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="flex-1 rounded-lg bg-red px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-redHover"
            >
              Применить
            </button>
          </div>
        </div>
      </motion.div>
    </>
  )
}

FilterSidebar.propTypes = {
  activeSort: PropTypes.string,
  onSortChange: PropTypes.func.isRequired,
  stagedBrands: PropTypes.array.isRequired,
  stagedPriceMin: PropTypes.string.isRequired,
  stagedPriceMax: PropTypes.string.isRequired,
  stagedInStockOnly: PropTypes.bool.isRequired,
  onToggleBrand: PropTypes.func.isRequired,
  onPriceMinChange: PropTypes.func.isRequired,
  onPriceMaxChange: PropTypes.func.isRequired,
  onInStockToggle: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  activeFilterCount: PropTypes.number.isRequired,
}
