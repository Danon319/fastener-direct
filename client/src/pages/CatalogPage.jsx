// Страница каталога: данные из content/catalog (PRODUCTS), без запросов к API.
// Hotfix 7.5: лэндинг-архитектура — фиксированный тулбар, тёмная каталог-секция
// (motion.section + momentumLift) поднимается над фоном с вертикальными колоночными линиями.
// Hotfix 7.6: тулбар закреплён по центру и переключается в visibility:hidden при прокрутке
// за высоту вьюпорта (паттерн Hero). Breadcrumbs удалены. Footer-спейсер перенесён внутрь
// каталог-секции — bg-navy продолжается до Footer. Добавлена FAB «наверх».
import { useState, useCallback, useMemo, useEffect } from 'react'
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
import { useMomentumLift, useElementHeight } from '@/hooks'
import { PRODUCTS, findCategoryBySlug, findSubcategoryBySlug } from '@/content/catalog'

/** Мультивыбор: если значение уже в массиве — убрать, иначе добавить (черновик брендов в сайдбаре). */
function toggleInArray(arr, value) {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]
}

/** Сброс фильтров в сайдбаре и начальное состояние applied. */
const EMPTY_FILTERS = {
  brands: [],
  priceMin: '',
  priceMax: '',
  inStockOnly: false,
}

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
// Hotfix 7.7: фиксированное число товаров на странице (~4 ряда × 4 колонки на десктопе).
const ITEMS_PER_PAGE = 16
// Hotfix 7.7: высота «защитного» пэддинга снизу секции — равна амплитуде momentum-lift.
// Когда пружина даёт отрицательный overshoot (до -100px), bg-navy не «уезжает» вверх и
// под ним не оголяется CatalogBackground (серый фон с вертикальными линиями).
const SPRING_OVERSHOOT_PAD_PX = 100

export default function CatalogPage() {
  const { category, subcategory } = useParams()

  const lift = useMomentumLift()
  const footerH = useElementHeight('footer')

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

  // Строка поиска по названию товара (клиентский includes, см. useMemo ниже).
  const [searchQuery, setSearchQuery] = useState('')
  // Выпадающий блок выбора категории под тулбаром.
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false)
  // Боковая панель фильтров и сортировки.
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false)
  const [activeSort, setActiveSort] = useState(null)
  // applied — то, что уже влияет на сетку товаров; staged — черновик в сайдбаре до «Применить».
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS)
  const [stagedFilters, setStagedFilters] = useState(EMPTY_FILTERS)
  // Hotfix 7.7: текущая страница пагинации (1-based). Сбрасывается при смене фильтров/поиска/URL.
  const [currentPage, setCurrentPage] = useState(1)

  // Счётчик для бейджа «Фильтры» в тулбаре (только применённые значения).
  const activeFilterCount = useMemo(() => {
    let count = appliedFilters.brands.length
    if (appliedFilters.priceMin) count++
    if (appliedFilters.priceMax) count++
    if (appliedFilters.inStockOnly) count++
    return count
  }, [appliedFilters])

  // Счётчик «Выбрано фильтров» в подвале сайдбара (черновик до применения).
  const stagedFilterCount = useMemo(() => {
    let count = stagedFilters.brands.length
    if (stagedFilters.priceMin) count++
    if (stagedFilters.priceMax) count++
    if (stagedFilters.inStockOnly) count++
    return count
  }, [stagedFilters])

  // --- Выпадающее меню «Каталог» (навигация по URL) ---
  const handleCatalogToggle = useCallback(() => {
    setIsCategoryDropdownOpen((p) => !p)
  }, [])

  const handleCatalogClose = useCallback(() => {
    setIsCategoryDropdownOpen(false)
  }, [])

  // --- Сайдбар фильтров: при открытии копируем applied → staged, чтобы редактировать копию ---
  const handleFilterToggle = useCallback(() => {
    setIsFilterSidebarOpen((prev) => {
      if (!prev) {
        setStagedFilters(appliedFilters)
      }
      return !prev
    })
  }, [appliedFilters])

  // Закрытие без обязательного применения (staged может отличаться до следующего открытия).
  const handleFilterClose = useCallback(() => {
    setIsFilterSidebarOpen(false)
  }, [])

  // Перенос черновика фильтров на сетку товаров.
  const handleApply = useCallback(() => {
    setAppliedFilters(stagedFilters)
  }, [stagedFilters])

  // Обнулить только черновик в панели (на сетку не влияет, пока не нажали «Применить»).
  const handleReset = useCallback(() => {
    setStagedFilters(EMPTY_FILTERS)
  }, [])

  // Обработчики изменения черновых фильтров
  const handleToggleBrand = useCallback((brand) => {
    setStagedFilters((prev) => ({
      ...prev,
      brands: toggleInArray(prev.brands, brand),
    }))
  }, [])

  const handlePriceMinChange = useCallback((val) => {
    setStagedFilters((prev) => ({ ...prev, priceMin: val }))
  }, [])

  const handlePriceMaxChange = useCallback((val) => {
    setStagedFilters((prev) => ({ ...prev, priceMax: val }))
  }, [])

  const handleInStockToggle = useCallback(() => {
    setStagedFilters((prev) => ({ ...prev, inStockOnly: !prev.inStockOnly }))
  }, [])

  // --- Hotfix 7.5: снятие отдельных «чипов» активных фильтров ---
  const handleClearSearch = useCallback(() => setSearchQuery(''), [])

  const handleRemoveAppliedBrand = useCallback((brand) => {
    setAppliedFilters((prev) => ({ ...prev, brands: prev.brands.filter((b) => b !== brand) }))
  }, [])

  const handleClearPrice = useCallback(() => {
    setAppliedFilters((prev) => ({ ...prev, priceMin: '', priceMax: '' }))
  }, [])

  const handleClearInStock = useCallback(() => {
    setAppliedFilters((prev) => ({ ...prev, inStockOnly: false }))
  }, [])

  // Фильтрация и сортировка товаров
  const filtered = useMemo(() => {
    let result = PRODUCTS

    // 1. Фильтр по URL-параметрам. Lookups идут через helpers (единый источник правды).
    if (category && subcategory) {
      const found = findSubcategoryBySlug(subcategory)
      if (found && found.parent.slug === category) {
        result = result.filter((p) => p.subcategory === found.subcategory.categoryKey)
      } else {
        result = []
      }
    } else if (category) {
      if (findCategoryBySlug(category)) {
        result = result.filter((p) => p.parentCategory === category)
      } else {
        result = []
      }
    }

    // 2. Фильтр по бренду
    if (appliedFilters.brands.length > 0) {
      result = result.filter((p) => appliedFilters.brands.includes(p.brand))
    }

    // 3. Диапазон цен (строки из input → parseFloat; пустое/NaN пропускается).
    if (appliedFilters.priceMin) {
      const min = parseFloat(appliedFilters.priceMin)
      if (!isNaN(min)) {
        result = result.filter((p) => p.price >= min)
      }
    }
    if (appliedFilters.priceMax) {
      const max = parseFloat(appliedFilters.priceMax)
      if (!isNaN(max)) {
        result = result.filter((p) => p.price <= max)
      }
    }

    // 4. Только в наличии
    if (appliedFilters.inStockOnly) {
      result = result.filter((p) => p.inStock)
    }

    // 5. Поиск по названию
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      result = result.filter((p) => p.name.toLowerCase().includes(q))
    }

    // 6. Сортировка (копия массива, чтобы не мутировать исходный PRODUCTS).
    if (activeSort) {
      result = [...result]
      switch (activeSort) {
        case 'price-asc':
          result.sort((a, b) => a.price - b.price)
          break
        case 'price-desc':
          result.sort((a, b) => b.price - a.price)
          break
        case 'name-asc':
          result.sort((a, b) => a.name.localeCompare(b.name, 'ru'))
          break
        case 'in-stock':
          result.sort((a, b) => (b.inStock ? 1 : 0) - (a.inStock ? 1 : 0))
          break
      }
    }

    return result
  }, [category, subcategory, appliedFilters, searchQuery, activeSort])

  // Hotfix 7.7: при смене входов фильтрации сбрасываем страницу на 1.
  useEffect(() => {
    setCurrentPage(1)
  }, [category, subcategory, appliedFilters, searchQuery, activeSort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const productsToRender = useMemo(
    () => filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [filtered, currentPage]
  )

  return (
    <>
      {/* Декоративный фиксированный фон со светлой заливкой и колоночными линиями (z-0). */}
      <CatalogBackground />

      {/* Тулбар-«Hero»: fixed по центру вьюпорта, прячется (visibility:hidden) при прокрутке. Внутрь — Dropdown. */}
      <CatalogToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onFilterToggle={handleFilterToggle}
        activeFilterCount={activeFilterCount}
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

      {/* Тёмная каталог-секция: motion + momentumLift, скруглённые верхние углы.
          Hotfix 7.7: pb-[100px] добавлен внизу секции — компенсация для отрицательного overshoot
          пружины momentum-lift (амплитуда ±100px). При резком скролле вверх секция «уезжает»
          на -100px, и без этого паддинга под её низом проглядывал CatalogBackground. */}
      <motion.section
        style={{ y: lift, paddingBottom: SPRING_OVERSHOOT_PAD_PX }}
        className="relative z-10 min-h-screen rounded-t-2xl bg-navy will-change-transform"
      >
        <div className="px-4 pb-8 pt-10 md:px-8 md:pt-14 lg:px-12 lg:pt-16">
          <ActiveFilterChips
            category={category}
            subcategory={subcategory}
            searchQuery={searchQuery}
            brands={appliedFilters.brands}
            priceMin={appliedFilters.priceMin}
            priceMax={appliedFilters.priceMax}
            inStockOnly={appliedFilters.inStockOnly}
            onClearSearch={handleClearSearch}
            onRemoveBrand={handleRemoveAppliedBrand}
            onClearPrice={handleClearPrice}
            onClearInStock={handleClearInStock}
          />

          {/* Сетка: скелетоны на initial load, иначе stagger fade-in реальных карточек. */}
          {isInitialLoading ? (
            <div
              className="mt-4 justify-center gap-4 lg:gap-6"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 250px))',
              }}
            >
              {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div
              className="mt-4 justify-center gap-4 lg:gap-6"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 250px))',
              }}
            >
              <AnimatePresence mode="popLayout">
                {productsToRender.map((product, i) => (
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
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            className="mb-[50px]"
          />
        )}

        {/* Hotfix 7.6: спейсер под фиксированный Footer внесён внутрь тёмной секции,
            чтобы bg-navy продолжался до самого Footer и фон каталога не «просвечивал».
            Hotfix 7.7: высота уменьшена вдвое — между последним рядом карточек и Footer
            оставалось слишком много пустого тёмного пространства. */}
        <div style={{ height: footerH / 2 }} aria-hidden="true" />
      </motion.section>

      {/* Плавающая FAB «наверх» — появляется после прокрутки >300px. */}
      <ScrollToTopButton />

      {/* Оверлей + выезд слева: сортировка, фильтры (staged), Сбросить / Применить. */}
      <AnimatePresence>
        {isFilterSidebarOpen && (
          <FilterSidebar
            activeSort={activeSort}
            onSortChange={setActiveSort}
            stagedBrands={stagedFilters.brands}
            stagedPriceMin={stagedFilters.priceMin}
            stagedPriceMax={stagedFilters.priceMax}
            stagedInStockOnly={stagedFilters.inStockOnly}
            onToggleBrand={handleToggleBrand}
            onPriceMinChange={handlePriceMinChange}
            onPriceMaxChange={handlePriceMaxChange}
            onInStockToggle={handleInStockToggle}
            onApply={handleApply}
            onReset={handleReset}
            onClose={handleFilterClose}
            activeFilterCount={stagedFilterCount}
          />
        )}
      </AnimatePresence>
    </>
  )
}
