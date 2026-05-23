// Цепочка ссылок: Главная → Каталог → (опционально) категория и подкатегория по slug из URL.
// Hotfix 7.11: лейблы и сегменты пути берутся из helpers (getCategoryBreadcrumbPath) —
// единый источник правды CATEGORY_TREE.
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { getCategoryBreadcrumbPath } from '@/content/catalog'

export default function Breadcrumbs({ category, subcategory }) {
  const crumbs = [
    { label: 'Главная', to: '/' },
    { label: 'Каталог', to: '/catalog' },
  ]

  // Сегменты по категории/подкатегории — производные от CATEGORY_TREE через helpers.
  // Последний элемент в массиве — текущая страница (без `to`, не ссылка).
  const path = getCategoryBreadcrumbPath(category, subcategory)
  path.forEach((segment, i) => {
    const isCurrent = i === path.length - 1
    crumbs.push({
      label: segment.label,
      to: isCurrent ? undefined : `/catalog/${segment.slug}`,
    })
  })

  // Hotfix 7.5: цвета подобраны под тёмный фон каталог-секции (bg-navy).
  return (
    <nav className="mb-6 flex flex-wrap items-center gap-1.5 font-sans text-sm">
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1
        return (
          <span key={crumb.label} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-slateHover">/</span>}
            {isLast || !crumb.to ? (
              <span className="text-light">{crumb.label}</span>
            ) : (
              <Link
                to={crumb.to}
                className="text-slateHover transition-colors duration-200 hover:text-light"
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
