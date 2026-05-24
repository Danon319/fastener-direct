// src/components/sections/Header.jsx
//
// Fixed белый pill с backdrop-blur. Появляется через translateY анимацию
// когда scrollY проходит порог (window.innerHeight = высота dummy-Hero
// или реальной Hero-секции в Phase 4).
//
// Та же UX-логика что и в HeroHeader (Burger <md, nav-pills md+, MenuBtn
// всегда), но визуально это ПИЛЛ а не absolute прозрачный header.
import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { Logo, IconButton, NavPill } from '@/components/ui'
import { Burger, Plus, User } from '@/components/ui/icons'
import { useUiStore } from '@/store/slices/uiSlice'
import { LANG_LABELS, NAV_LINKS, ACCOUNT_LINK } from '@/content/header'
import { cn } from '@/utils/cn'

/**
 * Fixed pill-хедер. Появляется по скроллу через translateY.
 */
function Header() {
  const setMenuOpen = useUiStore((s) => s.setMenuOpen)
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [lang, setLang] = useState('ru')
  const [burgerOpen, setBurgerOpen] = useState(false)
  // SSR-safe: реальный scrollY синхронизируется через useEffect ниже после mount.
  const [scrollY, setScrollY] = useState(0)
  const dropdownRef = useRef(null)
  const triggerRef = useRef(null)

  const toggleLang = () => setLang((l) => (l === 'ru' ? 'en' : 'ru'))
  const langLabel = LANG_LABELS[lang] // TODO: i18n — реальные переводы после Phase 6

  // На главной: показывать после прокрутки на высоту экрана (Hero).
  // На других страницах: всегда видим.
  
  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const visible = !isHome || (scrollY > window.innerHeight)

  // Закрытие dropdown: тот же механизм что в HeroHeader.
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
        'fixed z-header flex h-14 items-center justify-between',
        'left-2.5 right-2.5 top-2.5 md:left-7 md:right-7 md:top-7 lg:left-12 lg:right-12 lg:top-12',
        'pl-3 pr-1.5 md:pl-5 md:pr-1.5',
        'py-1',
        'bg-white/95 backdrop-blur-md',
        'rounded-full',
        'transition-transform duration-[400ms] ease-in-out',
        visible ? 'translate-y-0' : '-translate-y-[calc(100%+60px)]'
      )}
    >
      {/* mobile: только марка */}
      <span className="md:hidden">
        <Logo variant="mark" theme="dark" to="/" />
      </span>
      {/* desktop: full в уменьшенном пресете */}
      <span className="hidden md:block">
        <Logo variant="full" theme="dark" scale="sm" to="/" />
      </span>

      <nav className="relative flex items-center gap-2 md:gap-0">
        {/* Мобильный (<md): Burger + выпадающее меню (светлая тема) */}
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
                'rounded-2xl bg-white text-navy shadow-[0_8px_28px_rgba(0,0,0,0.18)]',
                'flex flex-col gap-0.5 p-2 font-sans'
              )}
            >
              <DropdownItem
                onClick={() => {
                  toggleLang()
                  setBurgerOpen(false)
                }}
              >
                {langLabel}
              </DropdownItem>
              {NAV_LINKS.map((item) => (
                <DropdownItem key={item.label} to={item.to} onClick={() => setBurgerOpen(false)}>
                  {item.label}
                </DropdownItem>
              ))}
              <DropdownItem to={ACCOUNT_LINK.to} onClick={() => setBurgerOpen(false)}>
                {ACCOUNT_LINK.label}
              </DropdownItem>
            </div>
          )}
        </div>

        {/* Десктоп (md+): nav-pills */}
        <div className="hidden md:flex md:items-center">
          <NavPill variant="default" onClick={toggleLang}>
            {langLabel}
          </NavPill>
          {NAV_LINKS.map((item) => (
            <NavPill key={item.label} variant="default" to={item.to}>
              {item.label}
            </NavPill>
          ))}
          <NavPill variant="red" to={ACCOUNT_LINK.to}>
            <User size={18} className="text-white" />
            {ACCOUNT_LINK.label}
          </NavPill>
        </div>

        <IconButton variant="slate" ariaLabel="Открыть меню" onClick={() => setMenuOpen(true)}>
          <Plus />
        </IconButton>
      </nav>
    </header>
  )
}

function DropdownItem({ children, onClick, to }) {
  const classes = cn(
    'w-full px-3.5 py-2.5 text-left bg-transparent rounded-xl',
    'border-0 cursor-pointer font-sans text-sm font-medium leading-tight',
    'transition-colors duration-150',
    'text-navy hover:bg-black/5'
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

export default Header
