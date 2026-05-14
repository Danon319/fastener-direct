// Цепочка ссылок: Главная → Каталог → (опционально) категория и подкатегория по slug из URL.
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { BREADCRUMB_LABELS, CATEGORY_TREE } from '@/content/catalog'

/** Slug верхнего уровня из дерева CATEGORY_TREE (последний крошка без ссылки). */
function isTopLevelSlug(slug) {
  return CATEGORY_TREE.some((g) => g.slug === slug)
}

export default function Breadcrumbs({ category, subcategory }) {
  const crumbs = [
    { label: 'Главная', to: '/' },
    { label: 'Каталог', to: '/catalog' },
  ]

  // Добавляем подписи из BREADCRUMB_LABELS; последний элемент без `to` — текущая страница (не ссылка).
  if (category && BREADCRUMB_LABELS[category]) {
    if (subcategory && BREADCRUMB_LABELS[subcategory]) {
      // Оба уровня: родитель — ссылка, текущий — просто текст
      crumbs.push({
        label: BREADCRUMB_LABELS[category],
        to: `/catalog/${category}`,
      })
      crumbs.push({ label: BREADCRUMB_LABELS[subcategory] })
    } else if (isTopLevelSlug(category)) {
      crumbs.push({ label: BREADCRUMB_LABELS[category] })
    }
  }

  return (
    <nav className="mb-6 flex flex-wrap items-center gap-1.5 font-sans text-sm">
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1
        return (
          <span key={crumb.label} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-muted">/</span>}
            {isLast || !crumb.to ? (
              <span className="text-navy">{crumb.label}</span>
            ) : (
              <Link
                to={crumb.to}
                className="text-muted transition-colors duration-200 hover:text-navy"
              >
                {crumb.label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}

Breadcrumbs.propTypes = {
  category: PropTypes.string,
  subcategory: PropTypes.string,
}
