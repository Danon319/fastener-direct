// Поле поиска каталога: контролируемый input; строка запроса и обработчик живут в CatalogPage.
import PropTypes from 'prop-types'

import { Search } from '@/components/ui/icons'

/**
 * Поле поиска по каталогу — контролируемый input.
 *
 * @param {Object} props
 * @param {string} props.value - Текущая строка поиска.
 * @param {(value: string) => void} props.onChange - Вызывается при вводе текста.
 */
export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative min-w-[200px] max-w-[500px] flex-1">
      <label htmlFor="catalog-search" className="sr-only">
        Поиск по каталогу
      </label>
      {/* Декоративная иконка; клики попадают в input под ней */}
      <Search
        size={18}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
      />
      <input
        id="catalog-search"
        name="search"
        type="text"
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Поиск по каталогу"
        className="h-10 w-full rounded-lg bg-transparent pl-10 pr-4 font-sans text-sm text-navy outline-none placeholder:text-muted"
      />
    </div>
  )
}

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}
