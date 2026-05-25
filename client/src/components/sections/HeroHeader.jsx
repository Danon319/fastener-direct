// src/components/sections/HeroHeader.jsx
//
// Fixed header поверх Hero (transparent фон, белый текст).
// Рендерится в Home.jsx параллельно Hero (не внутри). При скролле уезжает
// вверх синхронно со scrollY через motion useScroll/useTransform.
// К моменту scrollY = innerHeight / 2 уже полностью за верхним краем,
// в этот же момент появляется обычный Header (нет overlap-диапазона).
//
// Mobile (<md): Burger открывает локальный dropdown с пунктами nav.
// Desktop (md+): nav-pills видны inline.
// MenuBtn (серый круг с +) — виден всегда, открывает MobileMenu (Zustand).
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'motion/react'

import { Logo, IconButton, NavPill } from '@/components/ui'
import { Burger, Plus, User } from '@/components/ui/icons'
import { useUiStore } from '@/store/slices/uiSlice'
import { LANG_LABELS, NAV_LINKS, ACCOUNT_LINK } from '@/content/header'
import { cn } from '@/utils/cn'

/**
 * Fixed хедер поверх Hero-секции (transparent + white text).
 * Уезжает вверх со скроллом через useScroll/useTransform.
 */
function HeroHeader() {
  const setMenuOpen = useUiStore((s) => s.setMenuOpen)
  const [lang, setLang] = useState('ru')
  const [burgerOpen, setBurgerOpen] = useState(false)
  const dropdownRef = useRef(null)
  const triggerRef = useRef(null)

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
      {/* mobile: только марка */}
      <span className="md:hidden">
        <Logo variant="mark" theme="light" to="/" />
      </span>
      {/* desktop: full в уменьшенном пресете */}
      <span className="hidden md:block">
        <Logo variant="full" theme="light" scale="sm" to="/" />
      </span>

      <nav className="relative flex items-center gap-2 md:gap-0">
        {/* Мобильный (<md): Burger + выпадающее меню */}
        <div className="md:hidden">
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
        </div>

        {/* Десктоп (md+): nav-pills инлайн */}
        <div className="hidden md:flex md:items-center">
          <NavPill variant="heroLang" className="md:px-5 md:py-3 md:text-base" onClick={toggleLang}>
            {langLabel}
          </NavPill>
          {NAV_LINKS.map((item) => (
            <NavPill
              key={item.label}
              variant="heroWhite"
              className="hidden lg:inline-flex lg:px-5 lg:py-3 lg:text-base"
              to={item.to}
            >
              {item.label}
            </NavPill>
          ))}
          <NavPill variant="red" className="md:px-5 md:py-3 md:text-base" to={ACCOUNT_LINK.to}>
            <User size={18} className="text-white" />
            {ACCOUNT_LINK.label}
          </NavPill>
        </div>

        {/* MenuBtn — серый круг с +, всегда виден, открывает MobileMenu */}
        <IconButton variant="slate" size={48} ariaLabel="Открыть меню" onClick={() => setMenuOpen(true)}>
          <Plus />
        </IconButton>
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
