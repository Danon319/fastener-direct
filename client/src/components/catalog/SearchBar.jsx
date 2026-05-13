import PropTypes from 'prop-types'

import { Search } from '@/components/ui/icons'

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative max-w-[500px] min-w-[200px] flex-1">
      <Search
        size={18}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
      />
      <input
        type="text"
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
