import { useState, useCallback, useMemo, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { AnimatePresence } from 'motion/react'

import ProductCard from '@/components/ui/ProductCard'
import Breadcrumbs from '@/components/catalog/Breadcrumbs'
import CatalogToolbar from '@/components/catalog/CatalogToolbar'
import CategoryDropdown from '@/components/catalog/CategoryDropdown'
import FilterSidebar from '@/components/catalog/FilterSidebar'
import { PRODUCTS, CATEGORY_TREE } from '@/content/catalog'

function toggleInArray(arr, value) {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]
}

const EMPTY_FILTERS = {
  brands: [],
  priceMin: '',
  priceMax: '',
  inStockOnly: false,
}

export default function CatalogPage() {
  const { category, subcategory } = useParams()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [category, subcategory])

  const [searchQuery, setSearchQuery] = useState('')
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false)
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false)
  const [activeSort, setActiveSort] = useState(null)
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS)
  const [stagedFilters, setStagedFilters] = useState(EMPTY_FILTERS)

  const activeFilterCount = useMemo(() => {
    let count = appliedFilters.brands.length
    if (appliedFilters.priceMin) count++
    if (appliedFilters.priceMax) count++
    if (appliedFilters.inStockOnly) count++
    return count
  }, [appliedFilters])

  const stagedFilterCount = useMemo(() => {
    let count = stagedFilters.brands.length
    if (stagedFilters.priceMin) count++
    if (stagedFilters.priceMax) count++
    if (stagedFilters.inStockOnly) count++
    return count
  }, [stagedFilters])

  const handleCatalogToggle = useCallback(() => {
    setIsCategoryDropdownOpen((p) => !p)
  }, [])

  const handleCatalogClose = useCallback(() => {
    setIsCategoryDropdownOpen(false)
  }, [])

  const handleFilterToggle = useCallback(() => {
    setIsFilterSidebarOpen((prev) => {
      if (!prev) {
        setStagedFilters(appliedFilters)
      }
      return !prev
    })
  }, [appliedFilters])

  const handleFilterClose = useCallback(() => {
    setIsFilterSidebarOpen(false)
  }, [])

  const handleApply = useCallback(() => {
    setAppliedFilters(stagedFilters)
  }, [stagedFilters])

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

  // Фильтрация и сортировка товаров
  const filtered = useMemo(() => {
    let result = PRODUCTS

    // 1. Фильтр по URL-параметрам (2 уровня)
    if (category && subcategory) {
      const parent = CATEGORY_TREE.find((g) => g.slug === category)
      const sub = parent?.children.find((c) => c.slug === subcategory)
      if (sub) {
        result = result.filter((p) => p.subcategory === sub.categoryKey)
      } else {
        result = []
      }
    } else if (category) {
      const parent = CATEGORY_TREE.find((g) => g.slug === category)
      if (parent) {
        result = result.filter((p) => p.parentCategory === category)
      } else {
        result = []
      }
    }

    // 2. Фильтр по бренду
    if (appliedFilters.brands.length > 0) {
      result = result.filter((p) => appliedFilters.brands.includes(p.brand))
    }

    // 3. Диапазон цен
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

    // 6. Сортировка
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

  return (
    <div className="min-h-screen bg-light">
      <div className="px-4 pb-8 pt-28 md:px-8 md:pt-32 lg:px-12 lg:pt-36">
        <Breadcrumbs category={category} subcategory={subcategory} />

        {/* mb-[200px] — отступ под выпадающее меню категорий */}
        <div className="relative mb-[200px]">
          <CatalogToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onFilterToggle={handleFilterToggle}
            activeFilterCount={activeFilterCount}
            onCatalogToggle={handleCatalogToggle}
            isCatalogOpen={isCategoryDropdownOpen}
          />

          <AnimatePresence>
            {isCategoryDropdownOpen && (
              <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-40">
                <CategoryDropdown onClose={handleCatalogClose} />
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Сетка товаров */}
        {filtered.length > 0 ? (
          <div
            className="mt-6 justify-center gap-4 lg:gap-6"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 250px))',
            }}
          >
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="py-20 text-center font-sans text-lg text-muted">Ничего не найдено</p>
        )}
      </div>

      {/* Боковая панель фильтров */}
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
    </div>
  )
}
