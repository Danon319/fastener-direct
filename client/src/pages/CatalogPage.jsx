// UI-оркестратор каталога: прозрачная шапка + светлый hero-блок с закрепляемым тулбаром
// + тёмная (navy) секция с сеткой товаров. Логика фильтрации/сортировки/пагинации — useCatalogFilters.
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import PropTypes from 'prop-types'

import ProductCard from '@/components/ui/ProductCard'
import ScrollToTopButton from '@/components/ui/ScrollToTopButton'
import { GridLines } from '@/components/ui'
import { Search } from '@/components/ui/icons'
import CatalogToolbar from '@/components/catalog/CatalogToolbar'
import FilterButton from '@/components/catalog/FilterButton'
import SearchBar from '@/components/catalog/SearchBar'
import SortDropdown from '@/components/catalog/SortDropdown'
import CategoryButton from '@/components/catalog/CategoryButton'
import ActiveFilterChips from '@/components/catalog/ActiveFilterChips'
import ProductCardSkeleton from '@/components/catalog/ProductCardSkeleton'
import Pagination from '@/components/catalog/Pagination'
import { useBreakpoint, useCatalogFilters } from '@/hooks'
import { useUiStore } from '@/store'

// Длительность «фейковой» первичной загрузки (мс) — пока показываются скелетоны.
const INITIAL_LOAD_MS = 300
// Сколько скелетон-карточек рендерить на начальной фазе.
const SKELETON_COUNT = 8
// Шаг задержки между появлением соседних карточек в stagger fade-in.
const CARD_STAGGER_S = 0.04
// Верхний потолок задержки — иначе последняя карточка ждёт слишком долго.
const MAX_STAGGER_DELAY_S = 0.25
const CARD_FADE_DURATION_S = 0.3

// Колоночные линии фона hero-блока.
const DESKTOP_COLUMNS = 15
const MOBILE_COLUMNS = 6

// Интринзик-грид (токен grid-cols-cards = repeat(auto-fill, minmax(280px, 1fr)) в конфиге):
// все карточки одной ширины на любом экране, меняется только число колонок. На телефоне база
// grid-cols-2 (иначе auto-fill дал бы одну гигантскую колонку); интринзик включается с md+.
// max-w-[1800px] + mx-auto — потолок: на 2560px выходит ровно 6 колонок по ~285px, контейнер
// по центру. Карточки заполняют ячейку; на узких ячейках телефона (< 224px) отступы и нижняя
// строка реагируют по container-query (см. ProductCard).
const GRID_CLASS =
  'mx-auto grid max-w-[1800px] grid-cols-2 gap-[18px] md:grid-cols-cards'

// Пустой результат — стилизован под тёмную секцию.
function EmptyState({ onReset }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-full bg-white/5 text-slateHover">
        <Search size={26} />
      </span>
      <div>
        <p className="text-[17px] font-medium text-light">Ничего не найдено</p>
        <p className="mt-1 text-[13.5px] text-slateHover">
          Попробуйте изменить запрос или сбросить фильтры
        </p>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="inline-flex h-10 items-center gap-2 rounded-full bg-red px-5 text-[13px] font-medium text-white transition-colors hover:bg-redHover"
      >
        Сбросить фильтры
      </button>
    </div>
  )
}

EmptyState.propTypes = {
  onReset: PropTypes.func.isRequired,
}

/**
 * Страница каталога товаров.
 *
 * Композиция: сайтовый Header (fixed, светлая тема — рендерится в App) → светлый
 * hero-блок с закрепляемым CatalogToolbar → тёмная секция (bg-navy) с сеткой
 * товаров и пагинацией. Фильтрация, сортировка, пагинация — useCatalogFilters.
 */
export default function CatalogPage() {
  const { category, subcategory } = useParams()
  const navigate = useNavigate()

  const filters = useCatalogFilters()
  const setMenuOpen = useUiStore((s) => s.setMenuOpen)
  const isDesktop = useBreakpoint('lg', true)
  const columns = isDesktop ? DESKTOP_COLUMNS : MOBILE_COLUMNS

  // При смене раздела каталога в URL — показать страницу с начала (как новый вход в ветку).
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [category, subcategory])

  const [isInitialLoading, setIsInitialLoading] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setIsInitialLoading(false), INITIAL_LOAD_MS)
    return () => clearTimeout(t)
  }, [])

  // Снять все применённые фильтры (для пустого состояния).
  const resetAllFilters = () => {
    navigate('/catalog')
    filters.setSearchQuery('')
    filters.appliedFilters.brands.forEach((b) => filters.removeFilter('brand', b))
    filters.removeFilter('price')
    filters.removeFilter('inStock')
  }

  return (
    <>
      {/* ── Светлый hero-блок с колоночными линиями + закрепляемый тулбар ── */}
      <div className="relative z-40 bg-light">
        <GridLines columns={columns} />
        <div className="relative mx-auto max-w-[1500px] px-6 pb-20 pt-24 md:px-10 md:pt-32 lg:pb-24 lg:pt-36">
          <CatalogToolbar onMenuOpen={() => setMenuOpen(true)}>
            <FilterButton
              stagedBrands={filters.stagedBrands}
              stagedPriceMin={filters.stagedPriceMin}
              stagedPriceMax={filters.stagedPriceMax}
              stagedInStockOnly={filters.stagedInStockOnly}
              onToggleBrand={filters.toggleStagedBrand}
              onPriceMinChange={filters.setStagedPriceMin}
              onPriceMaxChange={filters.setStagedPriceMax}
              onInStockToggle={filters.toggleStagedInStockOnly}
              onSyncStaged={filters.syncStagedFromApplied}
              onApply={filters.applyStaged}
              onReset={filters.resetStaged}
            />
            <SearchBar value={filters.searchQuery} onChange={filters.setSearchQuery} />
            <SortDropdown value={filters.activeSort} onChange={filters.setActiveSort} />
            <CategoryButton />
          </CatalogToolbar>
        </div>
      </div>

      {/* ── Тёмная секция каталога: скруглённый верх, поверх стыка с hero ── */}
      <section className="relative z-10 -mt-3 min-h-screen rounded-t-2xl bg-navy">
        <div className="px-6 pb-16 pt-8 md:px-10">
          <div className="mb-6">
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
          </div>

          {/* Сетка: скелетоны на initial load, иначе stagger fade-in реальных карточек. */}
          {isInitialLoading ? (
            <div className={GRID_CLASS}>
              {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : filters.pagedProducts.length > 0 ? (
            <div className={GRID_CLASS}>
              <AnimatePresence mode="popLayout">
                {filters.pagedProducts.map((product, i) => (
                  <motion.div
                    key={product.id}
                    className="w-full"
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
            <EmptyState onReset={resetAllFilters} />
          )}
        </div>

        {/* Пагинация — только если страниц больше одной. */}
        {filters.totalPages > 1 && (
          <Pagination
            currentPage={filters.currentPage}
            totalPages={filters.totalPages}
            onPageChange={filters.setCurrentPage}
            className="pb-14"
          />
        )}
      </section>

      {/* Плавающая FAB «наверх» — появляется после прокрутки. */}
      <ScrollToTopButton />
    </>
  )
}
