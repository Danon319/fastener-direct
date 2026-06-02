// Кнопка «Категории» в тулбаре: красный триггер + поповер с двухшаговым CategoryDropdown.
import { Grid, ChevronDown } from '@/components/ui/icons'
import { cn } from '@/utils/cn'

import ToolbarMenu from './ToolbarMenu'
import CategoryDropdown from './CategoryDropdown'

/**
 * Кнопка-триггер «Категории» с выпадающим выбором раздела.
 * Навигация по маршрутам /catalog/... живёт внутри CategoryDropdown.
 */
export default function CategoryButton() {
  return (
    <ToolbarMenu
      align="right"
      panelClassName="w-[min(680px,86vw)]"
      renderTrigger={({ open, toggle }) => (
        <button
          type="button"
          onClick={toggle}
          className="inline-flex h-10 items-center gap-2.5 rounded-full bg-red px-4 text-[13px] font-medium text-white transition-colors hover:bg-redHover"
        >
          <Grid size={16} />
          Категории
          <ChevronDown
            size={14}
            className={cn('transition-transform duration-200', open && 'rotate-180')}
          />
        </button>
      )}
    >
      {(close) => <CategoryDropdown onClose={close} />}
    </ToolbarMenu>
  )
}
