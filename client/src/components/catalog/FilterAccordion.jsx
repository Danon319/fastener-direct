// Сворачиваемый блок с чекбоксами: плоский список (бренды/наличие).
import { useState } from 'react'
import PropTypes from 'prop-types'
import { motion, AnimatePresence } from 'motion/react'

import { Checkbox } from '@/components/ui'
import { ChevronDown } from '@/components/ui/icons'

/**
 * Сворачиваемый блок фильтра со списком чекбоксов (например, бренды или наличие).
 *
 * @param {Object} props
 * @param {string} props.title - Заголовок блока.
 * @param {Array<string|{value: string, label: string}>} props.items - Пункты списка.
 * @param {string[]} props.selected - Выбранные значения.
 * @param {(value: string) => void} props.onToggle - Переключение пункта.
 */
export default function FilterAccordion({ title, items, selected, onToggle }) {
  const [open, setOpen] = useState(true)

  // Режим плоского списка: items — строки или { value, label }; selected — массив выбранных value.
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-2"
      >
        <span className="font-sans text-sm font-medium text-navy">{title}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-muted"
        >
          <ChevronDown size={16} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            {items.map((item) => {
              const val = typeof item === 'string' ? item : item.value
              const label = typeof item === 'string' ? item : item.label
              return (
                <Checkbox
                  key={val}
                  checked={selected.includes(val)}
                  onChange={() => onToggle(val)}
                  label={label}
                />
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

FilterAccordion.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  selected: PropTypes.array.isRequired,
  onToggle: PropTypes.func.isRequired,
}
