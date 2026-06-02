// Поле поиска каталога: контролируемый input в стиле тулбара (пилюля bg-light).
// Строка запроса и обработчик живут в CatalogPage (поиск по названию товара).
import PropTypes from 'prop-types'

import { Search, Close } from '@/components/ui/icons'

/**
 * Поле поиска по каталогу — контролируемая пилюля с иконкой и кнопкой очистки.
 *
 * @param {Object} props
 * @param {string} props.value - Текущая строка поиска.
 * @param {(value: string) => void} props.onChange - Вызывается при вводе текста.
 */
export default function SearchBar({ value, onChange }) {
  return (
    <div className="flex h-10 min-w-[180px] flex-1 items-center gap-2.5 rounded-full bg-light px-4 text-muted ring-1 ring-black/5 transition-shadow focus-within:ring-2 focus-within:ring-red">
      <label htmlFor="catalog-search" className="sr-only">
        Поиск по каталогу
      </label>
      <Search size={17} className="shrink-0 text-muted" />
      <input
        id="catalog-search"
        name="search"
        type="text"
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Поиск по названию"
        className="w-full bg-transparent text-[13px] text-navy outline-none placeholder:text-muted"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Очистить поиск"
          className="shrink-0 text-muted transition-colors hover:text-navy"
        >
          <Close size={15} />
        </button>
      )}
    </div>
  )
}

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}
