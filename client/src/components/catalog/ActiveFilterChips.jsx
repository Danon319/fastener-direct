// Активные фильтры как чип-пилюли над сеткой. Источник — URL-параметры, applied-фильтры, поиск.
// Тон чипа кодирует тип: раздел (красный), подраздел (тёмно-красный), поиск (серый), фасет (белый).
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'

import { Close } from '@/components/ui/icons'
import { getCategoryLabel } from '@/content/catalog'
import { cn } from '@/utils/cn'

// Тон → классы фона/группы/крестика. Рассчитаны на тёмную (navy) секцию каталога.
const CHIP_TONES = {
  red: {
    box: 'bg-red text-white',
    group: 'text-white/65',
    x: 'text-white/75 hover:bg-white/20 hover:text-white',
  },
  darkred: {
    box: 'bg-redHover text-white',
    group: 'text-white/55',
    x: 'text-white/70 hover:bg-white/20 hover:text-white',
  },
  grey: {
    box: 'bg-light text-navy',
    group: 'text-muted',
    x: 'text-muted hover:bg-navy/10 hover:text-navy',
  },
  white: {
    box: 'bg-white text-navy',
    group: 'text-muted',
    x: 'text-muted hover:bg-navy/10 hover:text-navy',
  },
}

function Chip({ group, label, tone, onRemove }) {
  const t = CHIP_TONES[tone] ?? CHIP_TONES.white
  return (
    <motion.span
      initial={{ opacity: 0, y: 4, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.18 }}
      className={cn(
        'inline-flex h-8 items-center gap-2 rounded-full pl-3.5 pr-2 text-[12.5px] shadow-sm',
        t.box
      )}
    >
      <span className={t.group}>{group}:</span> {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label="Убрать фильтр"
        className={cn('grid h-5 w-5 place-items-center rounded-full transition-colors', t.x)}
      >
        <Close size={12} />
      </button>
    </motion.span>
  )
}

Chip.propTypes = {
  group: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  tone: PropTypes.oneOf(['red', 'darkred', 'grey', 'white']).isRequired,
  onRemove: PropTypes.func.isRequired,
}

/**
 * Ряд чип-пилюль активных фильтров. Если ни один фильтр не задан — возвращает null.
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

  const categoryLabel = getCategoryLabel(category)
  if (category && categoryLabel) {
    chips.push({
      key: 'cat',
      group: 'Раздел',
      label: categoryLabel,
      tone: 'red',
      onRemove: () => navigate('/catalog'),
    })
  }

  const subcategoryLabel = getCategoryLabel(subcategory)
  if (subcategory && subcategoryLabel && category) {
    chips.push({
      key: 'sub',
      group: 'Подраздел',
      label: subcategoryLabel,
      tone: 'darkred',
      onRemove: () => navigate(`/catalog/${category}`),
    })
  }

  if (searchQuery.trim()) {
    chips.push({
      key: 'search',
      group: 'Поиск',
      label: `«${searchQuery.trim()}»`,
      tone: 'grey',
      onRemove: onClearSearch,
    })
  }

  brands.forEach((brand) => {
    chips.push({
      key: `brand-${brand}`,
      group: 'Бренд',
      label: brand,
      tone: 'white',
      onRemove: () => onRemoveBrand(brand),
    })
  })

  if (priceMin || priceMax) {
    chips.push({
      key: 'price',
      group: 'Цена',
      label: `${priceMin || '0'} – ${priceMax || '∞'} ₽`,
      tone: 'white',
      onRemove: onClearPrice,
    })
  }

  if (inStockOnly) {
    chips.push({
      key: 'stock',
      group: 'Наличие',
      label: 'В наличии',
      tone: 'white',
      onRemove: onClearInStock,
    })
  }

  if (chips.length === 0) return null

  // «Очистить всё» — снимает всё через те же обработчики, что и отдельные чипы.
  const handleClearAll = () => {
    if (category) navigate('/catalog')
    if (searchQuery.trim()) onClearSearch()
    brands.forEach((b) => onRemoveBrand(b))
    if (priceMin || priceMax) onClearPrice()
    if (inStockOnly) onClearInStock()
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((c) => (
        <Chip key={c.key} group={c.group} label={c.label} tone={c.tone} onRemove={c.onRemove} />
      ))}
      <button
        type="button"
        onClick={handleClearAll}
        className="inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[12.5px] text-slateHover transition-colors hover:text-red"
      >
        Очистить всё
      </button>
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
