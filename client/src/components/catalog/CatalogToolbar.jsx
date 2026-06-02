// Тулбар каталога: пилюля с управляющими элементами (передаются как children).
// При прокрутке тот же тулбар переходит в fixed и плавно раскрывается в «toolbar-header»
// (CSS-transition по max-width — движение реверсивное), а справа проявляется кнопка меню.
import { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import { cn } from '@/utils/cn'

// Закрепление на 48px от верхней границы; триггер — когда естественная позиция доходит до 48px.
const PIN_TOP = 48
const PIN_TRIGGER_OFFSET = 48
// Раскрытие в toolbar-header (вариант «Плавно» из образца).
const ANIM_EASE = 'cubic-bezier(.22,1,.36,1)'
const ANIM_DUR = '.55s'
const ANIM_MS = 550
// Запас на отрисовку шрифтов перед повторным замером позиции.
const REMEASURE_DELAY_MS = 350

// Кнопка меню — последний элемент закреплённого бара. Появляется (scale+fade) вместе с раскрытием.
function InlineMenuButton({ expanded, onClick }) {
  return (
    <button
      type="button"
      aria-label="Открыть меню"
      onClick={onClick}
      style={{
        opacity: expanded ? 1 : 0,
        transform: expanded ? 'scale(1)' : 'scale(.55)',
        transition: `opacity ${ANIM_DUR} ${ANIM_EASE}, transform ${ANIM_DUR} ${ANIM_EASE}, background-color .2s ease`,
      }}
      className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-navy text-light hover:bg-slate"
    >
      <svg
        width={18}
        height={18}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.9}
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M4 7h16M4 12h16M4 17h16" />
      </svg>
    </button>
  )
}

InlineMenuButton.propTypes = {
  expanded: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
}

/**
 * Тулбар каталога. Управляющие элементы передаются как children и раскладываются в пилюле.
 * Самостоятельно отслеживает прокрутку и закрепляется в «toolbar-header».
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Контролы тулбара (фильтры, поиск, сортировка, категории).
 * @param {() => void} props.onMenuOpen - Открыть мобильное меню (кнопка в закреплённом баре).
 */
export default function CatalogToolbar({ children, onMenuOpen }) {
  const anchorRef = useRef(null) // нулевой якорь естественной позиции
  const toolbarRef = useRef(null) // сам бар — для высоты спейсера
  const pinPointRef = useRef(Infinity) // позиция закрепления (scrollY)
  const pinnedRef = useRef(false) // текущее состояние закрепления (без ре-рендера)
  const collapseTimer = useRef(null)
  const expandTimer = useRef(null)

  const [toolbarH, setToolbarH] = useState(64)
  // renderPinned — бар физически в fixed; expanded — целевая (полная) ширина.
  const [renderPinned, setRenderPinned] = useState(false)
  const [expanded, setExpanded] = useState(false)

  // Замер позиции якоря и высоты бара (+ повтор после загрузки шрифтов).
  useEffect(() => {
    const measure = () => {
      if (anchorRef.current) {
        pinPointRef.current =
          anchorRef.current.getBoundingClientRect().top + window.scrollY - PIN_TRIGGER_OFFSET
      }
      if (toolbarRef.current) setToolbarH(toolbarRef.current.offsetHeight)
    }
    measure()
    const id = setTimeout(measure, REMEASURE_DELAY_MS)
    window.addEventListener('resize', measure)
    return () => {
      clearTimeout(id)
      window.removeEventListener('resize', measure)
    }
  }, [])

  // Закрепление по позиции прокрутки. Состояние меняем в обработчике скролла (не в теле эффекта).
  // Реверсивное раскрытие/сворачивание: на сворачивании бар остаётся fixed до конца анимации,
  // поэтому обратное движение такое же плавное, как прямое.
  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > pinPointRef.current
      if (next === pinnedRef.current) return
      pinnedRef.current = next
      if (next) {
        clearTimeout(collapseTimer.current)
        setRenderPinned(true)
        // setTimeout (не rAF — работает и в фоновой вкладке): следующим тиком бар растёт → transition.
        expandTimer.current = setTimeout(() => setExpanded(true), 30)
      } else {
        clearTimeout(expandTimer.current)
        setExpanded(false)
        collapseTimer.current = setTimeout(() => setRenderPinned(false), ANIM_MS + 80)
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      clearTimeout(collapseTimer.current)
      clearTimeout(expandTimer.current)
    }
  }, [])

  return (
    <div className="relative">
      {/* Якорь естественной позиции + спейсер потока при закреплении */}
      <div ref={anchorRef} aria-hidden="true" className="h-0" />
      <div aria-hidden="true" style={{ height: renderPinned ? toolbarH : 0 }} />

      <div
        className={renderPinned ? 'fixed inset-x-0 z-[60]' : 'relative'}
        style={renderPinned ? { top: PIN_TOP } : undefined}
      >
        <div
          className="mx-auto"
          style={
            renderPinned
              ? {
                  maxWidth: expanded ? 'calc(100vw - 96px)' : 'min(1420px, calc(100vw - 80px))',
                  transitionProperty: 'max-width',
                  transitionDuration: ANIM_DUR,
                  transitionTimingFunction: ANIM_EASE,
                  willChange: 'max-width',
                }
              : undefined
          }
        >
          <div
            ref={toolbarRef}
            className={cn(
              'flex items-center gap-2 rounded-full bg-white p-1.5 ring-1 ring-black/5 transition-shadow duration-300',
              renderPinned
                ? 'shadow-[0_14px_36px_-10px_rgba(28,32,36,0.5)]'
                : 'shadow-[0_6px_24px_-12px_rgba(28,32,36,0.25)]'
            )}
          >
            {children}
            {renderPinned && (
              <>
                <span
                  aria-hidden="true"
                  className="mx-0.5 h-6 w-px shrink-0 bg-divider"
                  style={{
                    opacity: expanded ? 1 : 0,
                    transition: `opacity ${ANIM_DUR} ${ANIM_EASE}`,
                  }}
                />
                <InlineMenuButton expanded={expanded} onClick={onMenuOpen} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

CatalogToolbar.propTypes = {
  children: PropTypes.node.isRequired,
  onMenuOpen: PropTypes.func.isRequired,
}
