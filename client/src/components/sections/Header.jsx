// Fixed pill-хедер с opacity-fade. Виден после прокрутки Hero вниз; на остальных страницах — всегда.
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'motion/react'

import { Logo, IconButton, NavPill } from '@/components/ui'
import { Plus, User } from '@/components/ui/icons'
import { useUiStore } from '@/store'
import { useScrollDirection } from '@/hooks'
import { LANG_LABELS, NAV_LINKS, ACCOUNT_LINK, HOME_LINK } from '@/content/header'
import { cn } from '@/utils/cn'

// «Каталог» закреплён как всегда-видимый быстрый доступ; остальные ссылки появляются с lg.
const [CATALOG_LINK, ...SECONDARY_NAV_LINKS] = NAV_LINKS

/**
 * Fixed pill-хедер с opacity-fade появлением.
 */
function Header() {
  const setMenuOpen = useUiStore((s) => s.setMenuOpen)
  const location = useLocation()
  const isHome = location.pathname === '/'
  const isCatalog = location.pathname.startsWith('/catalog')
  // На catalog-роутах закреплённая ссылка «Каталог» подменяется на «Главная» → / (бесполезно
  // вести в каталог, уже находясь в нём). На остальных роутах — «Каталог».
  const catalogNavLink = isCatalog ? HOME_LINK : CATALOG_LINK
  // Состояние хедера: только язык (бургер-дропдаун убран в пользу единого MobileMenu).
  const [lang, setLang] = useState('ru')

  const toggleLang = () => setLang((l) => (l === 'ru' ? 'en' : 'ru'))
  const langLabel = LANG_LABELS[lang] // TODO: i18n — реальные переводы после Phase 6

  // На главной — порог = 50% Hero (на этом моменте HeroHeader уже уехал).
  // На остальных страницах — 0 (Hero нет).
  const heroThreshold = typeof window !== 'undefined' ? window.innerHeight / 2 : 0
  const { isPastThreshold, direction } = useScrollDirection({
    threshold: isHome ? heroThreshold : 0,
  })

  // На Home: visible = Hero пройден AND скролл вниз (freeze при overlay — неявный).
  // На не-Home: Header всегда виден.
  const visible = isHome ? isPastThreshold && direction === 'down' : true

  // На /catalog хедер уезжает вверх по позиции (паттерн HeroHeader), синхронно отдавая верх
  // доканному тулбару; opacity не трогаем. На остальных роутах transform нейтрален (y = 0).
  const { scrollY } = useScroll()
  const catalogLift = useTransform(scrollY, (v) => -v)

  return (
    <motion.header
      style={{ y: isCatalog ? catalogLift : 0 }}
      className={cn(
        'fixed z-header flex h-14 items-center justify-between',
        'left-2.5 right-2.5 top-2.5 md:left-7 md:right-7 md:top-7 lg:left-12 lg:right-12 lg:top-12',
        'pl-3 pr-1.5 md:pl-5 md:pr-1.5',
        'py-1',
        // На /catalog хедер прозрачный (без белой пилюли-подложки) — контент остаётся тёмным (navy)
        // и читается на светлом каталоге. На остальных роутах — обычная белая пилюля.
        isCatalog ? 'bg-transparent' : 'bg-white/95 backdrop-blur-md',
        'rounded-full',
        'transition-opacity duration-300',
        visible ? 'opacity-100' : 'pointer-events-none opacity-0'
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
        {/* Язык (md+) — первым, как в исходном порядке */}
        <NavPill
          variant="default"
          className="hidden md:inline-flex md:px-5 md:py-3 md:text-base"
          onClick={toggleLang}
        >
          {langLabel}
        </NavPill>

        {/* «Каталог» — всегда виден (быстрый доступ); на catalog-роутах → «Главная».
            Крупный размер (как на md+) на всех ширинах */}
        <NavPill
          variant="default"
          className="px-5 py-3 text-base md:px-5 md:py-3 md:text-base"
          to={catalogNavLink.to}
        >
          {catalogNavLink.label}
        </NavPill>

        {/* Десктоп (md+): остальные ссылки (lg+) + аккаунт */}
        <div className="hidden md:flex md:items-center">
          {SECONDARY_NAV_LINKS.map((item) => (
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

        {/* Кнопка меню — всегда видна, открывает единый MobileMenu */}
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

export default Header
