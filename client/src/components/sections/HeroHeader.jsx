// Fixed хедер поверх Hero (прозрачный фон, белый текст). Рендерится в Home.jsx параллельно Hero.
// Уезжает вверх со скроллом через useScroll/useTransform; к scrollY = innerHeight/2 полностью скрыт.
import { useState } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'

import { Logo, IconButton, NavPill } from '@/components/ui'
import { Plus, User } from '@/components/ui/icons'
import { useUiStore } from '@/store'
import { LANG_LABELS, NAV_LINKS, ACCOUNT_LINK } from '@/content/header'
import { cn } from '@/utils/cn'

// «Каталог» закреплён как всегда-видимый быстрый доступ; остальные ссылки появляются с lg.
const [CATALOG_LINK, ...SECONDARY_NAV_LINKS] = NAV_LINKS

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
  // Состояние хедера: только язык (бургер-дропдаун убран в пользу единого MobileMenu).
  const [lang, setLang] = useState('ru')

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
        {/* Язык (md+) — первым, как в исходном порядке (index 1) */}
        <motion.div className="hidden md:block" {...entranceProps(1)}>
          <NavPill variant="heroLang" className="md:px-5 md:py-3 md:text-base" onClick={toggleLang}>
            {langLabel}
          </NavPill>
        </motion.div>

        {/* «Каталог» — всегда виден (быстрый доступ), index 2; крупный размер (как на md+) на всех ширинах */}
        <motion.div {...entranceProps(2)}>
          <NavPill
            variant="heroWhite"
            className="px-5 py-3 text-base md:px-5 md:py-3 md:text-base"
            to={CATALOG_LINK.to}
          >
            {CATALOG_LINK.label}
          </NavPill>
        </motion.div>

        {/* Десктоп (md+): остальные ссылки (lg+, i=3..5) + аккаунт (i=6) */}
        <div className="hidden md:flex md:items-center">
          {SECONDARY_NAV_LINKS.map((item, i) => (
            <motion.div
              key={item.label}
              className="hidden lg:inline-flex"
              {...entranceProps(3 + i)}
            >
              <NavPill variant="heroWhite" className="lg:px-5 lg:py-3 lg:text-base" to={item.to}>
                {item.label}
              </NavPill>
            </motion.div>
          ))}
          <motion.div {...entranceProps(6)}>
            <NavPill variant="red" className="md:px-5 md:py-3 md:text-base" to={ACCOUNT_LINK.to}>
              <User size={18} className="text-white" />
              {ACCOUNT_LINK.label}
            </NavPill>
          </motion.div>
        </div>

        {/* MenuBtn — серый круг с +, всегда виден, открывает MobileMenu (index 7) */}
        <motion.div {...entranceProps(7)}>
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

export default HeroHeader
