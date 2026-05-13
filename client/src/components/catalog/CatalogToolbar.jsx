import PropTypes from 'prop-types'

import NavPill from '@/components/ui/NavPill'
import { Filter, ChevronDown } from '@/components/ui/icons'
import SearchBar from './SearchBar'
import { cn } from '@/utils/cn'

export default function CatalogToolbar({
  searchQuery,
  onSearchChange,
  onFilterToggle,
  activeFilterCount,
  onCatalogToggle,
  isCatalogOpen,
}) {
  return (
    <div className="mt-[180px] flex justify-center">
      {/* Пилюля тулбара — ширина по содержимому */}
      <div className="inline-flex items-center gap-3 rounded-full bg-white/95 px-5 py-1.5 backdrop-blur-md">
        {/* Кнопка фильтров */}
        <NavPill variant="default" onClick={onFilterToggle}>
          <Filter size={16} />
          <span className="hidden sm:inline">Фильтры</span>
          {activeFilterCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red text-xs text-white">
              {activeFilterCount}
            </span>
          )}
        </NavPill>

        {/* Поиск */}
        <SearchBar value={searchQuery} onChange={onSearchChange} />

        {/* Кнопка каталога */}
        <NavPill variant="red" onClick={onCatalogToggle}>
          <span className="hidden sm:inline">Каталог</span>
          <ChevronDown
            size={16}
            className={cn('transition-transform duration-200', isCatalogOpen && 'rotate-180')}
          />
        </NavPill>
      </div>
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
}
