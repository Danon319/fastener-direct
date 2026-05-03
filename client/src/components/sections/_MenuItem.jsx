// src/components/sections/_MenuItem.jsx
//
// Крупный nav-item для MobileMenu с выезжающей при hover стрелкой слева.
// Размеры адаптируются через Tailwind responsive classes.
// Приватный компонент — используется только в MobileMenu.jsx.
import { useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { cn } from '@/utils/cn'

// Custom arrow path — взят 1:1 из прототипа hero_section.jsx
// (viewBox 0 0 50 72, см. строки 733-745 прототипа).
const ARROW_PATH = 'M 4 36 L 46 36 M 30 20 L 46 36 L 30 52'

/**
 * Крупный анимированный пункт меню (MobileMenu).
 *
 * @param {object} props
 * @param {string} props.label
 * @param {"primary"|"secondary"} [props.size="primary"]
 * @param {"white"|"navy"} [props.color="white"]
 * @param {string} [props.to]
 * @param {() => void} [props.onClick]
 */
function MenuItem({ label, size = 'primary', color = 'white', to, onClick }) {
  const [hover, setHover] = useState(false)

  // Tailwind classes per size — точные пиксели из прототипа.
  // Primary (MENU_PRIMARY): мобильные размеры → desktop.
  // Secondary (MENU_SECONDARY): меньше во всех брейкпойнтах.
  const sizeClasses =
    size === 'primary'
      ? 'text-[28px] sm:text-[36px] md:text-[52px] lg:text-[72px] xl:text-[88px]'
      : 'text-[16px] sm:text-[20px] md:text-[28px] lg:text-[56px]'

  // Arrow dimensions per size, синхронизированные с шрифтом.
  // viewBox фиксирован 0 0 50 72; ширина анимируется 0 → arrowW.
  const arrowDims =
    size === 'primary'
      ? {
          w: 'w-[18px] sm:w-[24px] md:w-[36px] lg:w-[50px] xl:w-[60px]',
          h: 'h-[28px] sm:h-[36px] md:h-[52px] lg:h-[72px] xl:h-[88px]',
        }
      : {
          w: 'w-[10px] sm:w-[14px] md:w-[18px] lg:w-[34px]',
          h: 'h-[16px] sm:h-[20px] md:h-[28px] lg:h-[56px]',
        }

  const colorClass = color === 'white' ? 'text-white' : 'text-navy'

  // Inner content: arrow wrapper (animated width) + label.
  const inner = (
    <>
      <span
        aria-hidden="true"
        className={cn(
          'inline-flex flex-shrink-0 items-center overflow-hidden',
          arrowDims.h,
          'transition-[width] duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)]',
          hover ? arrowDims.w : 'w-0'
        )}
      >
        <svg
          className={cn('flex-shrink-0', arrowDims.w, arrowDims.h)}
          viewBox="0 0 50 72"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="butt"
          strokeLinejoin="miter"
        >
          <path d={ARROW_PATH} />
        </svg>
      </span>
      <span>{label}</span>
    </>
  )

  const baseClasses = cn(
    'inline-flex items-center w-fit text-left bg-transparent border-0 m-0 p-0 cursor-pointer',
    'font-sans font-medium leading-[1.1] tracking-[-0.01em]',
    sizeClasses,
    colorClass
  )

  if (to) {
    return (
      <Link
        to={to}
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={baseClasses}
      >
        {inner}
      </Link>
    )
  }
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={baseClasses}
    >
      {inner}
    </button>
  )
}

MenuItem.propTypes = {
  label: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['primary', 'secondary']),
  color: PropTypes.oneOf(['white', 'navy']),
  to: PropTypes.string,
  onClick: PropTypes.func,
}

export default MenuItem
