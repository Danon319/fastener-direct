// Fixed pill-хедер с opacity-fade. Виден после прокрутки Hero вниз; на остальных страницах — всегда.
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'motion/react'

import { Logo, MenuOpenButton, NavPill } from '@/components/ui'
import { User } from '@/components/ui/icons'
import { useUiStore } from '@/store'
import { useScrollDirection, useEntranceProps } from '@/hooks'
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

  // Поэлементный mount-entrance (канон HeroHeader). Индексы: 0 лого, 1 язык, 2 каталог/главная,
  // 3–5 вторичные ссылки, 6 аккаунт, 7 меню — пилюли «выплывают» по очереди. Каждая — свой
  // <motion.div>; внешний <motion.header> владеет scroll-driven translateY (dock на /catalog) и
  // opacity-fade, поэтому entrance на отдельных узлах с dock-трансформом не конфликтует.
  const entranceProps = useEntranceProps()

  // Ключ перезапуска entrance персистентного Header. Пока пользователь в каталоге — стабильный
  // 'catalog': entrance НЕ переигрывает при навигации внутри (/catalog → /catalog/bolts). Вне
  // каталога — location.key (уникален на каждую навигацию). При входе в каталог ключ меняется
  // (router-key → 'catalog') → 8 entrance-узлов перемонтируются и entrance играет заново — так
  // персистентный Header синхронизируется с тулбаром, который маунтится при каждом входе в каталог.
  const entranceKey = isCatalog ? 'catalog' : location.key

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
      {/* Лого (index 0): mobile-марка / desktop-full внутри одной entrance-обёртки */}
      <motion.div key={`${entranceKey}-0`} {...entranceProps(0)}>
        <span className="md:hidden">
          <Logo variant="mark" theme="dark" to="/" />
        </span>
        <span className="hidden md:block">
          <Logo variant="full" theme="dark" scale="sm" to="/" />
        </span>
      </motion.div>

      <nav className="relative flex items-center gap-2 md:gap-0">
        {/* Язык (md+) — index 1 */}
        <motion.div key={`${entranceKey}-1`} className="hidden md:block" {...entranceProps(1)}>
          <NavPill variant="default" className="md:px-5 md:py-3 md:text-base" onClick={toggleLang}>
            {langLabel}
          </NavPill>
        </motion.div>

        {/* «Каталог»/«Главная» — всегда виден (index 2); крупный размер на всех ширинах */}
        <motion.div key={`${entranceKey}-2`} {...entranceProps(2)}>
          <NavPill
            variant="default"
            className="px-5 py-3 text-base md:px-5 md:py-3 md:text-base"
            to={catalogNavLink.to}
          >
            {catalogNavLink.label}
          </NavPill>
        </motion.div>

        {/* Десктоп (md+): остальные ссылки (lg+, i=3..5) + аккаунт (i=6) */}
        <div className="hidden md:flex md:items-center">
          {SECONDARY_NAV_LINKS.map((item, i) => (
            <motion.div
              key={`${entranceKey}-${item.label}`}
              className="hidden lg:inline-flex"
              {...entranceProps(3 + i)}
            >
              <NavPill variant="default" className="lg:px-5 lg:py-3 lg:text-base" to={item.to}>
                {item.label}
              </NavPill>
            </motion.div>
          ))}
          <motion.div key={`${entranceKey}-6`} {...entranceProps(6)}>
            <NavPill variant="red" className="md:px-5 md:py-3 md:text-base" to={ACCOUNT_LINK.to}>
              <User size={18} className="text-white" />
              {ACCOUNT_LINK.label}
            </NavPill>
          </motion.div>
        </div>

        {/* Кнопка меню — всегда видна, открывает единый MobileMenu (index 7) */}
        <motion.div key={`${entranceKey}-7`} {...entranceProps(7)}>
          <MenuOpenButton onClick={() => setMenuOpen(true)} />
        </motion.div>
      </nav>
    </motion.header>
  )
}

export default Header
