// Fixed хедер поверх Hero (прозрачный фон, белый текст). Рендерится в Home.jsx параллельно Hero.
// Уезжает вверх со скроллом через useScroll/useTransform; к scrollY = innerHeight/2 полностью скрыт.
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'

import { Logo, IconButton, NavPill } from '@/components/ui'
import { Burger, Plus, User } from '@/components/ui/icons'
import { useUiStore } from '@/store/slices/uiSlice'
import { LANG_LABELS, NAV_LINKS, ACCOUNT_LINK } from '@/content/header'
import { cn } from '@/utils/cn'

// Mount-entrance координирован с tagline (~100ms задержка). Мягкий ease — элементы «выплывают» снизу.
const ENTRANCE_DURATION = 0.9
const ENTRANCE_EASE = [0.22, 1, 0.36, 1]
const ENTRANCE_Y = 40
const ENTRANCE_STAGGER = 0.1
const ENTRANCE_BASE_DELAY = 0.2

/**
 * Fixed хедер поверх Hero-секции (transparent + white text).
 * Уезжает вверх со скроллом через useScroll/useTransform.
 */
function HeroHeader() {
  const setMenuOpen = useUiStore((s) => s.setMenuOpen)
  const shouldReduceMotion = useReducedMotion()
  const [lang, setLang] = useState('ru')
  const [burgerOpen, setBurgerOpen] = useState(false)
  const dropdownRef = useRef(null)
  const triggerRef = useRef(null)

  // Index-based delay для последовательного entrance. Невидимые на текущем breakpoint
  // элементы сохраняют свой индекс — это допустимый компромисс ради простоты.
  const entranceProps = (index) => {
    if (shouldReduceMotion) {
      return { initial: false }
    }
    return {
      initial: { opacity: 0, y: ENTRANCE_Y },
      animate: { opacity: 1, y: 0 },
      transition: {
        duration: ENTRANCE_DURATION,
        delay: ENTRANCE_BASE_DELAY + index * ENTRANCE_STAGGER,
        ease: ENTRANCE_EASE,
      },
    }
  }

  // HeroHeader уезжает вверх вместе с потоком страницы: translateY = -scrollY.
  // Lenis обновляет window.scrollY интерполированно, поэтому движение плавное.
  const { scrollY } = useScroll()
  const translateY = useTransform(scrollY, (v) => -v)

  const toggleLang = () => setLang((l) => (l === 'ru' ? 'en' : 'ru'))
  const langLabel = LANG_LABELS[lang] // TODO: i18n — реальные переводы после Phase 6

  // Закрытие dropdown'а: Esc + клик снаружи. Игнорируем клик по trigger'у
  // (иначе dropdown закроется и тут же откроется из-за toggle).
  useEffect(() => {
    if (!burgerOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') setBurgerOpen(false)
    }
    const onDown = (e) => {
      if (triggerRef.current?.contains(e.target)) return
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setBurgerOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onDown)
    }
  }, [burgerOpen])

  return (
    <motion.header
      style={{ y: translateY }}
      className={cn(
        'fixed left-0 right-0 top-0 z-header',
        'flex items-center justify-between bg-transparent',
        'px-3 py-4 md:px-8 md:py-8 lg:px-12 lg:py-12'
      )}
    >
      {/* Logo (index 0): mount-entrance — обёртка motion, варианты mobile/desktop внутри */}
      <motion.div {...entranceProps(0)}>
        {/* mobile: только марка */}
        <span className="md:hidden">
          <Logo variant="mark" theme="light" to="/" />
        </span>
        {/* desktop: full в уменьшенном пресете */}
        <span className="hidden md:block">
          <Logo variant="full" theme="light" scale="sm" to="/" />
        </span>
      </motion.div>

      <nav className="relative flex items-center gap-2 md:gap-0">
        {/* Мобильный (<md): Burger + выпадающее меню (index 1) */}
        <motion.div className="md:hidden" {...entranceProps(1)}>
          <IconButton
            ref={triggerRef}
            variant="filled"
            size={48}
            ariaLabel="Меню навигации"
            onClick={() => setBurgerOpen((v) => !v)}
          >
            <Burger />
          </IconButton>
          {burgerOpen && (
            <div
              ref={dropdownRef}
              className={cn(
                'absolute right-0 top-[calc(100%+10px)] z-[150] min-w-44',
                'rounded-2xl bg-navy/95 text-white shadow-[0_8px_28px_rgba(0,0,0,0.18)]',
                'flex flex-col gap-0.5 p-2 font-sans'
              )}
            >
              <DropdownItem
                onClick={() => {
                  toggleLang()
                  setBurgerOpen(false)
                }}
                dark
              >
                {langLabel}
              </DropdownItem>
              {NAV_LINKS.map((item) => (
                <DropdownItem
                  key={item.label}
                  to={item.to}
                  onClick={() => setBurgerOpen(false)}
                  dark
                >
                  {item.label}
                </DropdownItem>
              ))}
              <DropdownItem to={ACCOUNT_LINK.to} onClick={() => setBurgerOpen(false)} dark>
                {ACCOUNT_LINK.label}
              </DropdownItem>
            </div>
          )}
        </motion.div>

        {/* Десктоп (md+): nav-pills инлайн (Lang i=1, NavLinks i=2..4, Account i=5) */}
        <div className="hidden md:flex md:items-center">
          <motion.div {...entranceProps(1)}>
            <NavPill
              variant="heroLang"
              className="md:px-5 md:py-3 md:text-base"
              onClick={toggleLang}
            >
              {langLabel}
            </NavPill>
          </motion.div>
          {NAV_LINKS.map((item, i) => (
            <motion.div
              key={item.label}
              className="hidden lg:inline-flex"
              {...entranceProps(2 + i)}
            >
              <NavPill variant="heroWhite" className="lg:px-5 lg:py-3 lg:text-base" to={item.to}>
                {item.label}
              </NavPill>
            </motion.div>
          ))}
          <motion.div {...entranceProps(5)}>
            <NavPill variant="red" className="md:px-5 md:py-3 md:text-base" to={ACCOUNT_LINK.to}>
              <User size={18} className="text-white" />
              {ACCOUNT_LINK.label}
            </NavPill>
          </motion.div>
        </div>

        {/* MenuBtn — серый круг с +, всегда виден, открывает MobileMenu (index 6) */}
        <motion.div {...entranceProps(6)}>
          <IconButton
            variant="slate"
            size={48}
            ariaLabel="Открыть меню"
            onClick={() => setMenuOpen(true)}
          >
            <Plus />
          </IconButton>
        </motion.div>
      </nav>
    </motion.header>
  )
}

// Внутренний хелпер для пунктов dropdown'а. Inline — не примитив.
function DropdownItem({ children, onClick, to, dark }) {
  const classes = cn(
    'w-full px-3.5 py-2.5 text-left bg-transparent rounded-xl',
    'border-0 cursor-pointer font-sans text-sm font-medium leading-tight',
    'transition-colors duration-150',
    dark ? 'text-white hover:bg-white/10' : 'text-navy hover:bg-black/5'
  )
  if (to) {
    return (
      <Link to={to} onClick={onClick} className={classes}>
        {children}
      </Link>
    )
  }
  return (
    <button type="button" onClick={onClick} className={classes}>
      {children}
    </button>
  )
}

export default HeroHeader
