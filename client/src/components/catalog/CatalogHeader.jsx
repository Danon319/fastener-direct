// Шапка каталога: прозрачная (без фона), тёмный текст под светлый hero-блок.
// Как HeroHeader — fixed сверху и уезжает вверх со скроллом (translateY = -scrollY),
// поэтому к моменту закрепления тулбара она уже за кадром, и кнопку меню берёт на себя toolbar-header.
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'motion/react'

import { Logo, IconButton, NavPill } from '@/components/ui'
import { Burger, Plus, User } from '@/components/ui/icons'
import { useUiStore } from '@/store'
import { LANG_LABELS, NAV_LINKS, ACCOUNT_LINK } from '@/content/header'
import { cn } from '@/utils/cn'

// Пункт мобильного выпадающего меню (светлая тема — hero светлый).
function DropdownItem({ children, onClick, to }) {
  const classes = cn(
    'w-full rounded-xl bg-transparent px-3.5 py-2.5 text-left',
    'cursor-pointer border-0 font-sans text-sm font-medium leading-tight',
    'text-navy transition-colors duration-150 hover:bg-black/5'
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

/**
 * Прозрачная шапка каталога с тёмным текстом, уезжающая вверх со скроллом.
 * Контент повторяет общий Header (лого, навигация, язык, аккаунт, кнопка меню).
 */
export default function CatalogHeader() {
  const setMenuOpen = useUiStore((s) => s.setMenuOpen)
  const [lang, setLang] = useState('ru')
  const [burgerOpen, setBurgerOpen] = useState(false)
  const dropdownRef = useRef(null)
  const triggerRef = useRef(null)

  const { scrollY } = useScroll()
  // Уезжает вверх вместе с потоком (Lenis обновляет scrollY интерполированно → плавно).
  const translateY = useTransform(scrollY, (v) => -v)

  const toggleLang = () => setLang((l) => (l === 'ru' ? 'en' : 'ru'))
  const langLabel = LANG_LABELS[lang]

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
        'fixed left-0 right-0 top-0 z-40',
        'flex items-center justify-between bg-transparent',
        'px-3 py-4 md:px-8 md:py-8 lg:px-12 lg:py-12'
      )}
    >
      {/* mobile: только марка; desktop: полный логотип */}
      <span className="md:hidden">
        <Logo variant="mark" theme="dark" to="/" />
      </span>
      <span className="hidden md:block">
        <Logo variant="full" theme="dark" scale="sm" to="/" />
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
          <NavPill variant="default" className="md:px-5 md:py-3 md:text-base" onClick={toggleLang}>
            {langLabel}
          </NavPill>
          {NAV_LINKS.map((item) => (
            <NavPill
              key={item.label}
              variant="default"
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

        {/* Кнопка меню — пока тулбар не закрепился, навигацию открывает она */}
        <IconButton
          variant="slate"
          size={48}
          ariaLabel="Открыть меню"
          onClick={() => setMenuOpen(true)}
        >
          <Plus />
        </IconButton>
      </nav>
    </motion.header>
  )
}
