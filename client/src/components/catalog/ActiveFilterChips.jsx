// Активные фильтры как «пилюли» над сеткой товаров. Каждая чип-пилюля содержит × для снятия.
// Источник данных — текущее состояние CatalogPage (URL-параметры, applied-фильтры, поиск).
// Hotfix 7.6: ~2× размер, цветовое кодирование по типу фильтра (категория/поиск/фильтр).
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

import { Close } from '@/components/ui/icons'
import { getCategoryLabel } from '@/content/catalog'
import { cn } from '@/utils/cn'

// Цветовые схемы по типу чипа. Цвет × наследуется через currentColor от Close.
const CHIP_STYLES = {
  category: 'bg-red text-light hover:brightness-110',
  search: 'bg-white text-navy hover:brightness-95',
  filter: 'bg-slateHover text-light hover:brightness-110',
}

function Chip({ label, onRemove, type }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-6 py-2.5 font-sans text-base transition',
        CHIP_STYLES[type]
      )}
    >
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label="Убрать фильтр"
        className="flex h-5 w-5 items-center justify-center rounded-full transition-opacity hover:opacity-70"
      >
        <Close size={18} />
      </button>
    </span>
  )
}

Chip.propTypes = {
  label: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['category', 'search', 'filter']).isRequired,
}

/**
 * Ряд чип-пилюль активных фильтров. Если ни один фильтр не задан — компонент возвращает null.
 */
export default function ActiveFilterChips({
  category,
  subcategory,
  searchQuery,
  brands,
  priceMin,
  priceMax,
  inStockOnly,
  onClearSearch,
  onRemoveBrand,
  onClearPrice,
  onClearInStock,
}) {
  const navigate = useNavigate()

  const chips = []

  // Категория из URL — снятие ведёт на /catalog
  const categoryLabel = getCategoryLabel(category)
  if (category && categoryLabel) {
    chips.push({
      key: 'cat',
      label: categoryLabel,
      onRemove: () => navigate('/catalog'),
      type: 'category',
    })
  }

  // Подкатегория из URL — снятие ведёт на родительскую категорию
  const subcategoryLabel = getCategoryLabel(subcategory)
  if (subcategory && subcategoryLabel && category) {
    chips.push({
      key: 'sub',
      label: subcategoryLabel,
      onRemove: () => navigate(`/catalog/${category}`),
      type: 'category',
    })
  }

  if (searchQuery.trim()) {
    chips.push({
      key: 'search',
      label: `Поиск: ${searchQuery.trim()}`,
      onRemove: onClearSearch,
      type: 'search',
    })
  }

  brands.forEach((brand) => {
    chips.push({
      key: `brand-${brand}`,
      label: brand,
      onRemove: () => onRemoveBrand(brand),
      type: 'filter',
    })
  })

  if (priceMin || priceMax) {
    const min = priceMin || '—'
    const max = priceMax || '—'
    chips.push({
      key: 'price',
      label: `Цена: ${min}–${max} ₽`,
      onRemove: onClearPrice,
      type: 'filter',
    })
  }

  if (inStockOnly) {
    chips.push({
      key: 'stock',
      label: 'В наличии',
      onRemove: onClearInStock,
      type: 'filter',
    })
  }

  if (chips.length === 0) return null

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {chips.map((c) => (
        <Chip key={c.key} label={c.label} onRemove={c.onRemove} type={c.type} />
      ))}
    </div>
  )
}

ActiveFilterChips.propTypes = {
  category: PropTypes.string,
  subcategory: PropTypes.string,
  searchQuery: PropTypes.string.isRequired,
  brands: PropTypes.arrayOf(PropTypes.string).isRequired,
  priceMin: PropTypes.string.isRequired,
  priceMax: PropTypes.string.isRequired,
  inStockOnly: PropTypes.bool.isRequired,
  onClearSearch: PropTypes.func.isRequired,
  onRemoveBrand: PropTypes.func.isRequired,
  onClearPrice: PropTypes.func.isRequired,
  onClearInStock: PropTypes.func.isRequired,
}
