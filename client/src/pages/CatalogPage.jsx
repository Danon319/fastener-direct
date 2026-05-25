// Страница каталога: данные из content/catalog (PRODUCTS), без запросов к API.
// Hotfix 7.5: лэндинг-архитектура — фиксированный тулбар, тёмная каталог-секция
// (motion.section + momentumLift) поднимается над фоном с вертикальными колоночными линиями.
// Hotfix 7.6: тулбар закреплён по центру и переключается в visibility:hidden при прокрутке
// за высоту вьюпорта (паттерн Hero). Breadcrumbs удалены. Footer-спейсер перенесён внутрь
// каталог-секции — bg-navy продолжается до Footer. Добавлена FAB «наверх».
// Hotfix 7.19: вся filter/sort/pagination логика вынесена в useCatalogFilters; здесь
// остался только UI-оркестратор (модалки, скелетоны, JSX-композиция).
import { useState, useCallback, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'

import ProductCard from '@/components/ui/ProductCard'
import ScrollToTopButton from '@/components/ui/ScrollToTopButton'
import CatalogToolbar from '@/components/catalog/CatalogToolbar'
import CategoryDropdown from '@/components/catalog/CategoryDropdown'
import FilterSidebar from '@/components/catalog/FilterSidebar'
import CatalogBackground from '@/components/catalog/CatalogBackground'
import ActiveFilterChips from '@/components/catalog/ActiveFilterChips'
import ProductCardSkeleton from '@/components/catalog/ProductCardSkeleton'
import Pagination from '@/components/catalog/Pagination'
import { useElementHeight, useCatalogFilters } from '@/hooks'

// Длительность «фейковой» первичной загрузки (мс) — пока показываются скелетоны.
const INITIAL_LOAD_MS = 300
// Сколько скелетон-карточек рендерить на начальной фазе.
const SKELETON_COUNT = 8
// Шаг задержки между появлением соседних карточек в stagger fade-in.
const CARD_STAGGER_S = 0.04
// Hotfix 7.13: верхний потолок задержки. Без него последняя из 16 карточек ждала 0.75с
// и каждое переключение страницы ощущалось как лаг.
const MAX_STAGGER_DELAY_S = 0.25
const CARD_FADE_DURATION_S = 0.3

// Hotfix 7.18: вынесено в const, чтобы skeleton-grid и real-grid использовали один источник правды.
const GRID_STYLE = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 250px))',
}

export default function CatalogPage() {
  const { category, subcategory } = useParams()

  const footerH = useElementHeight('footer')
  const filters = useCatalogFilters()

  // При смене раздела каталога в URL — показать страницу с начала (как новый вход в ветку).
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [category, subcategory])

  // Hotfix 7.5: первичная загрузка — флаг сбрасывается через INITIAL_LOAD_MS (скелетоны → карточки).
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setIsInitialLoading(false), INITIAL_LOAD_MS)
    return () => clearTimeout(t)
  }, [])

  // UI-состояние модалок (filter/category-dropdown).
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false)
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false)

  const handleCatalogToggle = useCallback(() => {
    setIsCategoryDropdownOpen((p) => !p)
  }, [])
  const handleCatalogClose = useCallback(() => {
    setIsCategoryDropdownOpen(false)
  }, [])

  // При открытии сайдбара — копируем applied → staged через хук.
  const handleFilterToggle = useCallback(() => {
    setIsFilterSidebarOpen((prev) => {
      if (!prev) filters.syncStagedFromApplied()
      return !prev
    })
  }, [filters])

  const handleFilterClose = useCallback(() => {
    setIsFilterSidebarOpen(false)
  }, [])

  return (
    <>
      {/* Декоративный фиксированный фон со светлой заливкой и колоночными линиями (z-0). */}
      <CatalogBackground />

      {/* Тулбар-«Hero»: fixed по центру вьюпорта, прячется (visibility:hidden) при прокрутке. Внутрь — Dropdown. */}
      <CatalogToolbar
        searchQuery={filters.searchQuery}
        onSearchChange={filters.setSearchQuery}
        onFilterToggle={handleFilterToggle}
        activeFilterCount={filters.activeFilterCount}
        onCatalogToggle={handleCatalogToggle}
        isCatalogOpen={isCategoryDropdownOpen}
      >
        <AnimatePresence>
          {isCategoryDropdownOpen && (
            <div className="absolute left-1/2 top-[calc(100%+10px)] z-40 w-full max-w-3xl -translate-x-1/2 px-4">
              <CategoryDropdown onClose={handleCatalogClose} />
            </div>
          )}
        </AnimatePresence>
      </CatalogToolbar>

      {/* Спейсер: создаёт «peek» — каталог-секция выглядывает ~10% из-под низа вьюпорта. */}
      <div className="h-[90vh]" aria-hidden="true" />

      {/* Тёмная каталог-секция: скруглённые верхние углы, поверх CatalogBackground. */}
      <section className="relative z-wrapper min-h-screen rounded-t-2xl bg-navy">
        <div className="px-4 pb-8 pt-10 md:px-8 md:pt-14 lg:px-12 lg:pt-16">
          <ActiveFilterChips
            category={category}
            subcategory={subcategory}
            searchQuery={filters.searchQuery}
            brands={filters.appliedFilters.brands}
            priceMin={filters.appliedFilters.priceMin}
            priceMax={filters.appliedFilters.priceMax}
            inStockOnly={filters.appliedFilters.inStockOnly}
            onClearSearch={() => filters.removeFilter('search')}
            onRemoveBrand={(brand) => filters.removeFilter('brand', brand)}
            onClearPrice={() => filters.removeFilter('price')}
            onClearInStock={() => filters.removeFilter('inStock')}
          />

          {/* Сетка: скелетоны на initial load, иначе stagger fade-in реальных карточек. */}
          {isInitialLoading ? (
            <div className="mt-4 justify-center gap-4 lg:gap-6" style={GRID_STYLE}>
              {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : filters.pagedProducts.length > 0 ? (
            <div className="mt-4 justify-center gap-4 lg:gap-6" style={GRID_STYLE}>
              <AnimatePresence mode="popLayout">
                {filters.pagedProducts.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: CARD_FADE_DURATION_S,
                      delay: Math.min(i * CARD_STAGGER_S, MAX_STAGGER_DELAY_S),
                    }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <p className="py-20 text-center font-sans text-lg text-slateHover">Ничего не найдено</p>
          )}
        </div>

        {/* Hotfix 7.7: пагинация — только если страниц больше одной. 50px отступа до footer-спейсера. */}
        {filters.totalPages > 1 && (
          <Pagination
            currentPage={filters.currentPage}
            totalPages={filters.totalPages}
            onPageChange={filters.setCurrentPage}
            className="mb-[50px]"
          />
        )}

        {/* Hotfix 7.6: спейсер под фиксированный Footer внесён внутрь тёмной секции,
            чтобы bg-navy продолжался до самого Footer и фон каталога не «просвечивал».
            Hotfix 7.7: высота уменьшена вдвое — между последним рядом карточек и Footer
            оставалось слишком много пустого тёмного пространства. */}
        <div style={{ height: footerH / 2 }} aria-hidden="true" />
      </section>

      {/* Плавающая FAB «наверх» — появляется после прокрутки >300px. */}
      <ScrollToTopButton />

      {/* Оверлей + выезд слева: сортировка, фильтры (staged), Сбросить / Применить. */}
      <AnimatePresence>
        {isFilterSidebarOpen && (
          <FilterSidebar
            activeSort={filters.activeSort}
            onSortChange={filters.setActiveSort}
            stagedBrands={filters.stagedBrands}
            stagedPriceMin={filters.stagedPriceMin}
            stagedPriceMax={filters.stagedPriceMax}
            stagedInStockOnly={filters.stagedInStockOnly}
            onToggleBrand={filters.toggleStagedBrand}
            onPriceMinChange={filters.setStagedPriceMin}
            onPriceMaxChange={filters.setStagedPriceMax}
            onInStockToggle={filters.toggleStagedInStockOnly}
            onApply={filters.applyStaged}
            onReset={filters.resetStaged}
            onClose={handleFilterClose}
            activeFilterCount={filters.stagedFilterCount}
          />
        )}
      </AnimatePresence>
    </>
  )
}
