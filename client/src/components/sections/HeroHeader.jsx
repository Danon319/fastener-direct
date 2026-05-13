// src/components/sections/HeroHeader.jsx
//
// Absolute header поверх Hero (transparent фон, белый текст).
// В Phase 3 размещается внутри dummy-Hero секции в Home.jsx.
// В Phase 4 переедет в реальную Hero-секцию (внутрь компонента Hero).
//
// Mobile (<md): Burger открывает локальный dropdown с пунктами nav.
// Desktop (md+): nav-pills видны inline.
// MenuBtn (серый круг с +) — виден всегда, открывает MobileMenu (Zustand).
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

import { Logo, IconButton, NavPill } from '@/components/ui'
import { Burger, Plus, User } from '@/components/ui/icons'
import { useUiStore } from '@/store/slices/uiSlice'
import { LANG_LABELS, NAV_LINKS, ACCOUNT_LINK } from '@/content/header'
import { cn } from '@/utils/cn'

/**
 * Absolute хедер поверх Hero-секции (transparent + white text).
 */
function HeroHeader() {
  const setMenuOpen = useUiStore((s) => s.setMenuOpen)
  const [lang, setLang] = useState('ru')
  const [burgerOpen, setBurgerOpen] = useState(false)
  const dropdownRef = useRef(null)
  const triggerRef = useRef(null)

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
    <header
      className={cn(
        'absolute left-0 right-0 top-0 z-10',
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
        {/* Mobile (<md): Burger + Dropdown */}
        <div className="md:hidden">
          <IconButton
            ref={triggerRef}
            variant="filled"
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

        {/* Desktop (md+): nav-pills inline */}
        <div className="hidden md:flex md:items-center">
          <NavPill variant="heroLang" onClick={toggleLang}>
            {langLabel}
          </NavPill>
          {NAV_LINKS.map((item) => (
            <NavPill key={item.label} variant="heroWhite" to={item.to}>
              {item.label}
            </NavPill>
          ))}
          <NavPill variant="red" to={ACCOUNT_LINK.to}>
            <User size={18} className="text-white" />
            {ACCOUNT_LINK.label}
          </NavPill>
        </div>

        {/* MenuBtn — серый круг с +, всегда виден, открывает MobileMenu */}
        <IconButton variant="slate" ariaLabel="Открыть меню" onClick={() => setMenuOpen(true)}>
          <Plus />
        </IconButton>
      </nav>
    </header>
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
