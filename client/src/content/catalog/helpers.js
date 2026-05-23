// Чистые утилиты для извлечения данных из CATEGORY_TREE / BRANDS / PRODUCTS.
// Hotfix 7.11: единый источник правды — компоненты не должны хардкодить slug'и,
// лейблы или подсчёты. Любая UI-надпись по категории/подкатегории должна
// получаться через getCategoryLabel; цепочка крошек — через getCategoryBreadcrumbPath.
import { CATEGORY_TREE } from './categories'

/**
 * Найти top-level категорию по её slug.
 *
 * @param {string} slug
 * @returns {Object|null} - объект из CATEGORY_TREE или null, если slug не найден.
 */
export function findCategoryBySlug(slug) {
  if (!slug) return null
  return CATEGORY_TREE.find((c) => c.slug === slug) ?? null
}

/**
 * Найти подкатегорию по её slug. Возвращает родителя и саму подкатегорию.
 *
 * @param {string} slug
 * @returns {{ parent: Object, subcategory: Object }|null}
 */
export function findSubcategoryBySlug(slug) {
  if (!slug) return null
  for (const parent of CATEGORY_TREE) {
    const subcategory = parent.children.find((c) => c.slug === slug)
    if (subcategory) return { parent, subcategory }
  }
  return null
}

/**
 * Получить человекочитаемый label для произвольного slug —
 * либо top-level категория, либо подкатегория.
 *
 * @param {string} slug
 * @returns {string|null}
 */
export function getCategoryLabel(slug) {
  const top = findCategoryBySlug(slug)
  if (top) return top.label
  const sub = findSubcategoryBySlug(slug)
  if (sub) return sub.subcategory.label
  return null
}

/**
 * Сформировать цепочку «крошек» (без префиксов «Главная» / «Каталог»):
 * только сегменты, относящиеся к категории/подкатегории.
 *
 * @param {string} [categorySlug]
 * @param {string} [subcategorySlug]
 * @returns {Array<{ label: string, slug: string }>}
 */
export function getCategoryBreadcrumbPath(categorySlug, subcategorySlug) {
  const path = []
  const top = findCategoryBySlug(categorySlug)
  if (top) {
    path.push({ label: top.label, slug: top.slug })
    if (subcategorySlug) {
      const sub = top.children.find((c) => c.slug === subcategorySlug)
      if (sub) path.push({ label: sub.label, slug: sub.slug })
    }
  }
  return path
}
