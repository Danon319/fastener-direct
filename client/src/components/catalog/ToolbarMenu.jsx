// Обвязка дропдаунов тулбара: триггер + поповер с анимацией всплытия,
// закрытие по клику снаружи и Escape. Используется кнопками «Фильтры», «Сортировка», «Категории».
import { useState, useRef, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { AnimatePresence, motion } from 'motion/react'

import { cn } from '@/utils/cn'

// Всплытие поповера от верхнего угла (origin задаётся по align).
const POP_TRANSITION = { duration: 0.18, ease: [0.22, 1, 0.36, 1] }

/**
 * Дропдаун тулбара: рендерит триггер (render-prop) и анимированный поповер под ним.
 * Сам управляет открытием/закрытием, кликом снаружи и Escape.
 *
 * @param {Object} props
 * @param {({ open: boolean, toggle: () => void }) => React.ReactNode} props.renderTrigger - Кнопка-триггер.
 * @param {React.ReactNode | ((close: () => void) => React.ReactNode)} props.children - Содержимое поповера.
 * @param {'left'|'right'} [props.align='left'] - Сторона выравнивания поповера.
 * @param {string} [props.panelClassName] - Классы для контейнера поповера (ширина и т.п.).
 */
export default function ToolbarMenu({ renderTrigger, children, align = 'left', panelClassName }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="relative shrink-0" ref={ref}>
      {renderTrigger({ open, toggle: () => setOpen((o) => !o) })}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -6 }}
            transition={POP_TRANSITION}
            style={{ transformOrigin: align === 'right' ? 'top right' : 'top left' }}
            className={cn(
              'absolute z-50 mt-2',
              align === 'right' ? 'right-0' : 'left-0',
              panelClassName
            )}
          >
            {typeof children === 'function' ? children(close) : children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

ToolbarMenu.propTypes = {
  renderTrigger: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  align: PropTypes.oneOf(['left', 'right']),
  panelClassName: PropTypes.string,
}
