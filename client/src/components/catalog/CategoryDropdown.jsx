// Двухшаговый выбор раздела: карточки верхнего уровня → подкатегории; navigate на маршруты /catalog/...
import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { motion } from 'motion/react'

import { CATEGORY_TREE } from '@/content/catalog'
import { cn } from '@/utils/cn'

// Возврат со списка подкатегорий к сетке родительских категорий.
function BackButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-3 inline-flex items-center gap-1.5 font-sans text-sm text-muted transition-colors hover:text-navy"
    >
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
      Назад
    </button>
  )
}

BackButton.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default function CategoryDropdown({ onClose }) {
  const navigate = useNavigate()
  // null — показаны родительские категории; иначе — выбранный узел и его children.
  const [selectedParent, setSelectedParent] = useState(null)

  // Закрытие по Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Переход на ветку каталога; при наличии подкатегорий — второй шаг без закрытия панели.
  const handleCategoryClick = useCallback(
    (cat) => {
      navigate(`/catalog/${cat.slug}`)
      if (cat.children.length > 0) {
        setSelectedParent(cat)
      } else {
        onClose()
      }
    },
    [navigate, onClose]
  )

  // Конечный slug подкатегории; после перехода панель закрывается.
  const handleSubcategoryClick = useCallback(
    (parentSlug, subSlug) => {
      navigate(`/catalog/${parentSlug}/${subSlug}`)
      onClose()
    },
    [navigate, onClose]
  )

  // Сброс шага «подкатегории» без смены URL (остаёмся на маршруте родителя из предыдущего клика).
  const handleBack = useCallback(() => {
    setSelectedParent(null)
  }, [])

  // Высота/opacity — анимация появления при монтировании внутри AnimatePresence на CatalogPage.
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="overflow-hidden"
    >
      <div className="rounded-xl bg-white p-5">
        {!selectedParent ? (
          /* Шаг 1 — карточки категорий */
          <div className="grid gap-3 md:grid-cols-3">
            {CATEGORY_TREE.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => handleCategoryClick(cat)}
                className={cn(
                  'group flex items-center gap-4 overflow-hidden rounded-lg border border-light p-3',
                  'transition-colors duration-200 hover:border-red hover:bg-red'
                )}
              >
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="h-16 w-16 shrink-0 rounded-md object-cover"
                />
                <span className="font-sans text-sm font-medium text-navy transition-colors group-hover:text-white">
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        ) : (
          /* Шаг 2 — подкатегории */
          <div>
            <BackButton onClick={handleBack} />
            <p className="mb-3 font-sans text-sm font-medium text-navy">{selectedParent.label}</p>
            <div className="flex flex-wrap gap-2">
              {selectedParent.children.map((sub) => (
                <button
                  key={sub.slug}
                  type="button"
                  onClick={() => handleSubcategoryClick(selectedParent.slug, sub.slug)}
                  className="rounded-full border border-light bg-light px-4 py-2 font-sans text-sm text-navy transition-colors hover:border-red hover:bg-red hover:text-white"
                >
                  {sub.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

CategoryDropdown.propTypes = {
  onClose: PropTypes.func.isRequired,
}
