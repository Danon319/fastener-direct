// Двухшаговый выбор раздела: карточки верхнего уровня → подкатегории. navigate на /catalog/...
// Содержимое поповера тулбара (открытие/анимацию даёт ToolbarMenu).
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'

import { Grid, Close } from '@/components/ui/icons'
import { CATEGORY_TREE } from '@/content/catalog'

// Иконка «назад» (стрелка влево) — локальная, нужна только здесь.
function BackArrow() {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  )
}

/**
 * Выпадающий выбор раздела в два шага: карточки категорий → их подкатегории.
 * Переходит на маршруты /catalog/... и закрывается через onClose.
 *
 * @param {Object} props
 * @param {() => void} props.onClose - Закрыть поповер.
 */
export default function CategoryDropdown({ onClose }) {
  const navigate = useNavigate()
  // null — показаны родительские категории; иначе — выбранный узел и его children.
  const [parent, setParent] = useState(null)

  // Клик по категории: с подкатегориями — шаг 2 без перехода; без — сразу на ветку каталога.
  const handleCategoryClick = (cat) => {
    if (cat.children.length > 0) {
      setParent(cat)
    } else {
      navigate(`/catalog/${cat.slug}`)
      onClose()
    }
  }

  const handleAll = (parentSlug) => {
    navigate(`/catalog/${parentSlug}`)
    onClose()
  }

  const handleSubcategoryClick = (parentSlug, subSlug) => {
    navigate(`/catalog/${parentSlug}/${subSlug}`)
    onClose()
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-popover ring-1 ring-black/5">
      {/* Шапка: иконка / «Назад» + крестик */}
      <div className="flex h-12 items-center justify-between gap-3 border-b border-divider px-5">
        {parent ? (
          <button
            type="button"
            onClick={() => setParent(null)}
            className="inline-flex items-center gap-1.5 text-[13px] text-muted transition-colors hover:text-navy"
          >
            <BackArrow /> Назад
          </button>
        ) : (
          <span className="inline-flex items-center gap-2 text-[13.5px] font-medium text-navy">
            <Grid size={16} className="text-muted" />
          </span>
        )}
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
          className="grid h-7 w-7 place-items-center rounded-full text-muted transition-colors hover:bg-light hover:text-navy"
        >
          <Close size={15} />
        </button>
      </div>

      <div className="p-5">
        {!parent ? (
          /* Шаг 1 — карточки категорий */
          <div className="grid gap-3 md:grid-cols-3">
            {CATEGORY_TREE.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => handleCategoryClick(cat)}
                className="group flex items-center gap-3 overflow-hidden rounded-xl border border-divider p-2.5 text-left transition-colors hover:border-red hover:bg-red"
              >
                <img
                  src={cat.image}
                  alt=""
                  className="h-14 w-14 shrink-0 rounded-lg object-cover"
                />
                <span className="text-[13.5px] font-medium text-navy transition-colors group-hover:text-white">
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        ) : (
          /* Шаг 2 — подкатегории */
          <div>
            <p className="mb-3 text-[13.5px] font-medium text-navy">{parent.label}</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleAll(parent.slug)}
                className="rounded-full border border-red bg-red px-4 py-2 text-[13px] text-white transition-colors hover:bg-redHover"
              >
                Все {parent.label.toLowerCase()}
              </button>
              {parent.children.map((sub) => (
                <button
                  key={sub.slug}
                  type="button"
                  onClick={() => handleSubcategoryClick(parent.slug, sub.slug)}
                  className="rounded-full border border-divider bg-light px-4 py-2 text-[13px] text-navy transition-colors hover:border-red hover:bg-red hover:text-white"
                >
                  {sub.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

CategoryDropdown.propTypes = {
  onClose: PropTypes.func.isRequired,
}
