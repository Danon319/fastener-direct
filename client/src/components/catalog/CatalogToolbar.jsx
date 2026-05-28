// Плавающая «пилюля» над каталогом: фильтры (сайдбар), поиск, кнопка дерева категорий.
// Фиксирован по центру вьюпорта; скрывается при прокрутке за его высоту (как Hero).
import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import NavPill from '@/components/ui/NavPill'
import { Filter, ChevronDown } from '@/components/ui/icons'
import { cn } from '@/utils/cn'

import SearchBar from './SearchBar'

export default function CatalogToolbar({
  searchQuery,
  onSearchChange,
  onFilterToggle,
  activeFilterCount,
  onCatalogToggle,
  isCatalogOpen,
  children,
}) {
  // Тулбар виден, пока пользователь не прокрутил больше высоты вьюпорта.
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY < window.innerHeight)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className="fixed left-0 right-0 top-1/2 z-hero -translate-y-1/2"
      style={{ visibility: visible ? 'visible' : 'hidden' }}
    >
      <div className="flex justify-center px-4">
        {/* Пилюля тулбара — ширина по содержимому */}
        <div className="inline-flex items-center gap-3 rounded-full bg-white/95 px-5 py-1.5 shadow-lg backdrop-blur-md">
          {/* Открывает FilterSidebar; бейдж — число применённых фильтров (не черновик staged). */}
          <NavPill
            variant="default"
            onClick={onFilterToggle}
            className="bg-slateHover text-light hover:bg-slateHover hover:brightness-90"
          >
            <Filter size={16} />
            <span className="hidden sm:inline">Фильтры</span>
            {activeFilterCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red text-xs text-white">
                {activeFilterCount}
              </span>
            )}
          </NavPill>

          {/* Клиентский поиск по названию товара на странице каталога */}
          <SearchBar value={searchQuery} onChange={onSearchChange} />

          {/* Раскрывает CategoryDropdown; стрелка крутится при открытии */}
          <NavPill variant="red" onClick={onCatalogToggle}>
            <span className="hidden sm:inline">Каталог</span>
            <ChevronDown
              size={16}
              className={cn('transition-transform duration-200', isCatalogOpen && 'rotate-180')}
            />
          </NavPill>
        </div>
      </div>

      {/* Слот для CategoryDropdown: позиционируется absolute относительно этого fixed-контейнера. */}
      {children}
    </div>
  )
}

CatalogToolbar.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onFilterToggle: PropTypes.func.isRequired,
  activeFilterCount: PropTypes.number.isRequired,
  onCatalogToggle: PropTypes.func.isRequired,
  isCatalogOpen: PropTypes.bool.isRequired,
  children: PropTypes.node,
}
