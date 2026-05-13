import { useState } from 'react'
import PropTypes from 'prop-types'
import { motion, AnimatePresence } from 'motion/react'

import { ChevronDown } from '@/components/ui/icons'
import { cn } from '@/utils/cn'

function Checkbox({ checked, onChange, label, indented }) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-center gap-2.5 py-1.5',
        indented && 'pl-5'
      )}
    >
      <span
        className={cn(
          'flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border transition-colors',
          checked ? 'border-red bg-red' : 'border-slate/30 bg-white'
        )}
        aria-hidden="true"
      >
        {checked && (
          <svg
            width={10}
            height={10}
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span className="font-sans text-sm text-navy">{label}</span>
    </label>
  )
}

Checkbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  indented: PropTypes.bool,
}

export default function FilterAccordion({
  title,
  items,
  selected,
  onToggle,
  isTree,
}) {
  const [open, setOpen] = useState(true)

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
                    <label className="flex cursor-pointer items-center gap-2.5 py-1.5">
                      <span
                        className={cn(
                          'flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border transition-colors',
                          allChecked
                            ? 'border-red bg-red'
                            : someChecked
                              ? 'border-red bg-white'
                              : 'border-slate/30 bg-white'
                        )}
                        aria-hidden="true"
                      >
                        {allChecked && (
                          <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                        {someChecked && !allChecked && (
                          <span className="block h-0.5 w-2 rounded bg-red" />
                        )}
                      </span>
                      <input
                        type="checkbox"
                        checked={allChecked}
                        onChange={() => {
                          // Переключить все дочерние категории
                          childKeys.forEach((k) => {
                            const isSelected = selected.includes(k)
                            if (allChecked && isSelected) onToggle(k)
                            if (!allChecked && !isSelected) onToggle(k)
                          })
                        }}
                        className="sr-only"
                      />
                      <span className="font-sans text-sm font-medium text-navy">
                        {group.label}
                      </span>
                    </label>

                    {group.children.map((child) => (
                      <Checkbox
                        key={child.categoryKey}
                        checked={selected.includes(child.categoryKey)}
                        onChange={() => onToggle(child.categoryKey)}
                        label={child.label}
                        indented
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

  // Плоский список
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
