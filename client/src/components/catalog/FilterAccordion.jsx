// Сворачиваемый блок с чекбоксами: либо плоский список (бренды), либо дерево групп с детьми (isTree).
import { useState } from 'react'
import PropTypes from 'prop-types'
import { motion, AnimatePresence } from 'motion/react'

import { Checkbox } from '@/components/ui'
import { ChevronDown } from '@/components/ui/icons'

export default function FilterAccordion({ title, items, selected, onToggle, isTree }) {
  const [open, setOpen] = useState(true)

  // Режим дерева: родитель — «выбрать всех детей» + частичное состояние; дети — отдельные ключи в selected.
  if (isTree) {
    // items — структура CATEGORY_TREE: [{ label, slug, children: [{ label, categoryKey }] }]
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
              {items.map((group) => {
                const childKeys = group.children.map((c) => c.categoryKey)
                const allChecked = childKeys.every((k) => selected.includes(k))
                const someChecked = childKeys.some((k) => selected.includes(k))

                return (
                  <div key={group.slug} className="pb-1">
                    <Checkbox
                      checked={allChecked}
                      indeterminate={someChecked && !allChecked}
                      onChange={() => {
                        // Переключить все дочерние категории
                        childKeys.forEach((k) => {
                          const isSelected = selected.includes(k)
                          if (allChecked && isSelected) onToggle(k)
                          if (!allChecked && !isSelected) onToggle(k)
                        })
                      }}
                      label={group.label}
                      labelClassName="font-medium"
                    />

                    {group.children.map((child) => (
                      <Checkbox
                        key={child.categoryKey}
                        checked={selected.includes(child.categoryKey)}
                        onChange={() => onToggle(child.categoryKey)}
                        label={child.label}
                        className="pl-5"
                      />
                    ))}
                  </div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

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
  isTree: PropTypes.bool,
}
