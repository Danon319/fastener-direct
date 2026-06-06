// Fullscreen overlay-меню (z-menu). Curtain-анимация колонками, грид-линии, staggered fade-in контента.
// Esc/click-outside закрытие, scroll-lock, focus-trap.
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'

import { Logo, IconButton, Button } from '@/components/ui'
import { Close } from '@/components/ui/icons'
import { useUiStore } from '@/store'
import { MENU_PRIMARY, MENU_SECONDARY, MENU_CTA } from '@/content/menu'
import { NAV_LINKS, ACCOUNT_LINK, LANG_LABELS } from '@/content/header'

import MenuItem from './_MenuItem'

// Навигация меню — единый источник из контента шапки (NAV_LINKS + аккаунт).
const NAV_ITEMS = [...NAV_LINKS, ACCOUNT_LINK]

// Тайминги анимации-шторки (падающие колонки) и проявления контента после неё.
const CURTAIN_STEP = 0.08
const CURTAIN_DURATION = 0.7
const CURTAIN_EASE = [0.55, 0, 0.1, 1]
const CONTENT_FADE_DURATION = 0.3
const CONTENT_STAGGER = 0.06

// matchMedia-helper для column count. Локальный, только для MobileMenu.
function useCurtainColumns() {
  const compute = () => {
    if (typeof window === 'undefined') return 11
    return window.innerWidth >= 768 ? 11 : 5
  }
  const [n, setN] = useState(compute)
  useEffect(() => {
    const onResize = () => setN(compute())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return n
}

// На экранах <375px логотип уменьшается до 42px, чтобы не перекрывать CloseBtn. С 375px — дефолт Logo (54px).
function useMobileMenuLogoSize() {
  const compute = () => {
    if (typeof window === 'undefined') return undefined
    return window.innerWidth < 375 ? 42 : undefined
  }
  const [size, setSize] = useState(compute)
  useEffect(() => {
    const onResize = () => setSize(compute())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return size
}

/**
 * Внутреннее тело MobileMenu (рендерится только когда открыт).
 */
function MobileMenuContent({ onClose }) {
  const columns = useCurtainColumns()
  const logoSize = useMobileMenuLogoSize()
  const shouldReduceMotion = useReducedMotion()
  // Переключатель языка (тот же контент, что в шапке). Клик не закрывает меню.
  const [lang, setLang] = useState('ru')
  const toggleLang = () => setLang((l) => (l === 'ru' ? 'en' : 'ru'))
  const langLabel = LANG_LABELS[lang] // TODO: i18n — реальные переводы после Phase 6
  // При reduced-motion пропускаем curtain — контент-слой виден сразу.
  const [curtainDone, setCurtainDone] = useState(() => shouldReduceMotion)
  const overlayRef = useRef(null)

  const curtainTotalMs = ((columns - 1) * CURTAIN_STEP + CURTAIN_DURATION) * 1000
  const lineStepPct = 100 / columns

  // Закрытие по Escape.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Блокируем скролл документа пока меню открыто.
  useEffect(() => {
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = 'hidden'
    return () => {
      html.style.overflow = prev
    }
  }, [])

  // Переключаем curtainDone после завершения последней колонки.
  useEffect(() => {
    if (shouldReduceMotion) return
    const t = setTimeout(() => setCurtainDone(true), curtainTotalMs)
    return () => clearTimeout(t)
  }, [curtainTotalMs, shouldReduceMotion])

  // Ловушка фокуса. Ручная реализация (без внешних библиотек).
  useEffect(() => {
    if (!curtainDone) return // ждём пока контент появится
    const root = overlayRef.current
    if (!root) return
    const focusables = root.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    if (focusables.length === 0) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    first.focus()
    const onKey = (e) => {
      if (e.key !== 'Tab') return
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    root.addEventListener('keydown', onKey)
    return () => root.removeEventListener('keydown', onKey)
  }, [curtainDone])

  const fadeIn = (delay) => ({
    initial: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: CONTENT_FADE_DURATION,
      // При reduced-motion обнуляем stagger-задержки — пункты появляются одновременно.
      delay: shouldReduceMotion ? 0 : delay,
      ease: 'easeOut',
    },
  })

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Главное меню"
      className="fixed inset-0 z-menu overflow-hidden font-sans text-white"
      style={{
        backgroundColor: curtainDone ? '#d03328' : 'transparent',
        boxShadow: curtainDone
          ? 'inset 1px 0 0 rgba(255,255,255,0.1), inset -1px 0 0 rgba(255,255,255,0.1)'
          : 'none',
      }}
    >
      {/* Falling columns layer — пока curtain не закончился */}
      {!curtainDone && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
          {Array.from({ length: columns }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              transition={{
                duration: CURTAIN_DURATION,
                delay: i * CURTAIN_STEP,
                ease: CURTAIN_EASE,
              }}
              className="absolute top-0 h-full bg-red"
              style={{
                left: `${i * lineStepPct}%`,
                width: `${lineStepPct}%`,
                willChange: 'transform',
              }}
            />
          ))}
        </div>
      )}

      {/* Вертикальные направляющие — после curtainDone, fade-in.
          Декоративные, повторяют позицию колонок. */}
      {curtainDone && (
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: `calc(100% / ${columns}) 100%`,
          }}
        />
      )}

      {/* Слой контента */}
      <div className="relative z-[1] box-border flex h-full flex-col overflow-y-auto px-6 py-12 md:px-12">
        {/* Шапка: Logo + кнопка закрытия */}
        <header className="flex items-center justify-between">
          {curtainDone && (
            <motion.div {...fadeIn(0)}>
              <Logo variant="full" theme="light" size={logoSize} />
            </motion.div>
          )}
          {curtainDone && (
            <motion.div {...fadeIn(CONTENT_STAGGER)}>
              <IconButton variant="slate" size={48} ariaLabel="Закрыть меню" onClick={onClose}>
                <Close />
              </IconButton>
            </motion.div>
          )}
        </header>

        {/* Центр меню: навигация по сайту + support-ссылки */}
        <div className="flex flex-1 flex-col items-start justify-center gap-8">
          {/* Навигация по сайту (компактная) — отдельной секцией перед support-ссылками */}
          <nav className="flex flex-col items-start gap-1">
            {curtainDone &&
              NAV_ITEMS.map((item, i) => (
                <motion.div key={item.label} {...fadeIn(CONTENT_STAGGER * (2 + i))}>
                  <MenuItem
                    label={item.label}
                    size="secondary"
                    color="white"
                    to={item.to}
                    onClick={onClose}
                  />
                </motion.div>
              ))}
          </nav>

          {/* Support-ссылки */}
          <div className="flex flex-col items-start gap-1">
            {curtainDone &&
              MENU_PRIMARY.map((item, i) => (
                <motion.div key={item.label} {...fadeIn(CONTENT_STAGGER * (7 + i))}>
                  <MenuItem
                    label={item.label}
                    size="primary"
                    color="white"
                    to={item.to}
                    onClick={onClose}
                  />
                </motion.div>
              ))}
          </div>
        </div>

        {/* Подвал: вторичные переключатели (тема / город / язык) + CTA */}
        <footer className="flex flex-col items-stretch gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 md:gap-12">
            {curtainDone &&
              MENU_SECONDARY.map((item, i) => (
                <motion.div key={item.label} {...fadeIn(CONTENT_STAGGER * (10 + i))}>
                  <MenuItem label={item.label} size="secondary" color="navy" onClick={() => {}} />
                </motion.div>
              ))}
            {/* Переключатель языка — справа от «Тема»/«Город», тот же размер и цвет */}
            {curtainDone && (
              <motion.div {...fadeIn(CONTENT_STAGGER * 12)}>
                <MenuItem label={langLabel} size="secondary" color="navy" onClick={toggleLang} />
              </motion.div>
            )}
          </div>
          {curtainDone && (
            <motion.div {...fadeIn(CONTENT_STAGGER * 13)} className="self-stretch sm:self-auto">
              <Button size="md" to={MENU_CTA.to} onClick={onClose}>
                {MENU_CTA.label}
              </Button>
            </motion.div>
          )}
        </footer>
      </div>
    </div>
  )
}

/**
 * Fullscreen mobile меню. Отрисовывается из Zustand `isMenuOpen`.
 */
function MobileMenu() {
  const isMenuOpen = useUiStore((s) => s.isMenuOpen)
  const setMenuOpen = useUiStore((s) => s.setMenuOpen)

  return (
    <AnimatePresence>
      {isMenuOpen && <MobileMenuContent onClose={() => setMenuOpen(false)} />}
    </AnimatePresence>
  )
}

export default MobileMenu
