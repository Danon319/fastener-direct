// Хук состояния и pipeline фильтрации каталога: фильтры, сортировка, пагинация.
// Используется в CatalogPage — вся логика фильтрации сосредоточена здесь.
import { useState, useCallback, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { PRODUCTS, findCategoryBySlug, findSubcategoryBySlug } from '@/content/catalog'

// Мультивыбор: если значение уже в массиве — убрать, иначе добавить.
function toggleInArray(arr, value) {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]
}

const EMPTY_FILTERS = {
  brands: [],
  priceMin: '',
  priceMax: '',
  inStockOnly: false,
}

const ITEMS_PER_PAGE = 16

// Подсчёт активных условий в объекте фильтров (для бейджа и подвала сайдбара).
function countFilters(f) {
  let count = f.brands.length
  if (f.priceMin) count++
  if (f.priceMax) count++
  if (f.inStockOnly) count++
  return count
}

/**
 * Состояние и pipeline фильтров каталога. Возвращает значения для контролируемых
 * инпутов (поиск, страница, сортировка), staged-черновик фильтров, applied-фильтры,
 * экшены (apply / reset / removeFilter / syncStagedFromApplied) и производные данные
 * (страница товаров, всего страниц, счётчики). URL-параметры :category и :subcategory
 * читаются изнутри через useParams, navigate — для снятия категорийных чипов.
 *
 * @returns {{
 *   searchQuery: string,
 *   setSearchQuery: (v: string) => void,
 *   currentPage: number,
 *   setCurrentPage: (p: number) => void,
 *   activeSort: string | null,
 *   setActiveSort: (s: string | null) => void,
 *   stagedBrands: string[],
 *   stagedPriceMin: string,
 *   stagedPriceMax: string,
 *   stagedInStockOnly: boolean,
 *   toggleStagedBrand: (brand: string) => void,
 *   setStagedPriceMin: (v: string) => void,
 *   setStagedPriceMax: (v: string) => void,
 *   toggleStagedInStockOnly: () => void,
 *   syncStagedFromApplied: () => void,
 *   appliedFilters: typeof EMPTY_FILTERS,
 *   applyStaged: () => void,
 *   resetStaged: () => void,
 *   removeFilter: (type: 'category'|'subcategory'|'search'|'brand'|'price'|'inStock', value?: string) => void,
 *   pagedProducts: Array<object>,
 *   totalPages: number,
 *   activeFilterCount: number,
 *   stagedFilterCount: number,
 * }}
 */
export default function useCatalogFilters() {
  const { category, subcategory } = useParams()
  const navigate = useNavigate()

  const [searchQuery, setSearchQuery] = useState('')
  const [activeSort, setActiveSort] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  // applied — реально влияет на сетку; staged — черновик в сайдбаре до «Применить».
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS)
  const [stagedFilters, setStagedFilters] = useState(EMPTY_FILTERS)

  // --- staged-обработчики (вызываются из FilterSidebar) ---
  const toggleStagedBrand = useCallback((brand) => {
    setStagedFilters((prev) => ({ ...prev, brands: toggleInArray(prev.brands, brand) }))
  }, [])

  const setStagedPriceMin = useCallback((val) => {
    setStagedFilters((prev) => ({ ...prev, priceMin: val }))
  }, [])

  const setStagedPriceMax = useCallback((val) => {
    setStagedFilters((prev) => ({ ...prev, priceMax: val }))
  }, [])

  const toggleStagedInStockOnly = useCallback(() => {
    setStagedFilters((prev) => ({ ...prev, inStockOnly: !prev.inStockOnly }))
  }, [])

  const syncStagedFromApplied = useCallback(() => {
    setStagedFilters(appliedFilters)
  }, [appliedFilters])

  // --- основные экшены сайдбара ---
  const applyStaged = useCallback(() => {
    setAppliedFilters(stagedFilters)
  }, [stagedFilters])

  const resetStaged = useCallback(() => {
    setStagedFilters(EMPTY_FILTERS)
  }, [])

  // --- снятие отдельных «чипов» активных фильтров ---
  // Для brand/price/inStock — синхронно правим и applied, и staged, чтобы следующее
  // открытие сайдбара не «оживило» удалённое условие.
  const removeFilter = useCallback(
    (type, value) => {
      switch (type) {
        case 'category':
          navigate('/catalog')
          break
        case 'subcategory':
          navigate(`/catalog/${category ?? ''}`)
          break
        case 'search':
          setSearchQuery('')
          break
        case 'brand':
          setAppliedFilters((prev) => ({
            ...prev,
            brands: prev.brands.filter((b) => b !== value),
          }))
          setStagedFilters((prev) => ({
            ...prev,
            brands: prev.brands.filter((b) => b !== value),
          }))
          break
        case 'price':
          setAppliedFilters((prev) => ({ ...prev, priceMin: '', priceMax: '' }))
          setStagedFilters((prev) => ({ ...prev, priceMin: '', priceMax: '' }))
          break
        case 'inStock':
          setAppliedFilters((prev) => ({ ...prev, inStockOnly: false }))
          setStagedFilters((prev) => ({ ...prev, inStockOnly: false }))
          break
      }
    },
    [navigate, category]
  )

  // --- pipeline фильтрации и сортировки ---
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

  // При смене входов фильтрации сбрасываем страницу на 1.
  // «Adjust state while rendering» — корректный способ синхронизации двух состояний без useEffect.
  const [prevFiltered, setPrevFiltered] = useState(filtered)
  if (prevFiltered !== filtered) {
    setPrevFiltered(filtered)
    setCurrentPage(1)
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))

  const pagedProducts = useMemo(
    () => filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [filtered, currentPage]
  )

  const activeFilterCount = countFilters(appliedFilters)
  const stagedFilterCount = countFilters(stagedFilters)

  return {
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    activeSort,
    setActiveSort,

    stagedBrands: stagedFilters.brands,
    stagedPriceMin: stagedFilters.priceMin,
    stagedPriceMax: stagedFilters.priceMax,
    stagedInStockOnly: stagedFilters.inStockOnly,
    toggleStagedBrand,
    setStagedPriceMin,
    setStagedPriceMax,
    toggleStagedInStockOnly,
    syncStagedFromApplied,

    appliedFilters,

    applyStaged,
    resetStaged,
    removeFilter,

    pagedProducts,
    totalPages,
    activeFilterCount,
    stagedFilterCount,
  }
}
