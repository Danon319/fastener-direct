// Крупный nav-item с hover-стрелкой для MobileMenu.
// Приватный компонент — используется только внутри MobileMenu.jsx.
import { useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { cn } from '@/utils/cn'

// Путь стрелки — взят 1:1 из прототипа (viewBox 0 0 50 72).
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

  // Tailwind-классы по размеру — точные пиксели из прототипа.
  const sizeClasses =
    size === 'primary'
      ? 'text-3xl md:text-5xl lg:text-7xl xl:text-[88px]'
      : 'text-base md:text-3xl lg:text-6xl'

  // Размеры стрелки по размеру, синхронизированы с шрифтом. viewBox 0 0 50 72.
  const arrowDims =
    size === 'primary'
      ? {
          w: 'w-5 md:w-9 lg:w-12 xl:w-16',
          h: 'h-7 md:h-14 lg:h-[72px] xl:h-[88px]',
        }
      : {
          w: 'w-2.5 md:w-5 lg:w-9',
          h: 'h-4 md:h-7 lg:h-14',
        }

  const colorClass = color === 'white' ? 'text-white' : 'text-navy'

  // Внутреннее содержимое: обёртка стрелки (анимированная ширина) + текст.
  const inner = (
    <>
      <span
        aria-hidden="true"
        className={cn(
          'inline-flex flex-shrink-0 items-center overflow-hidden',
          arrowDims.h,
          'transition-[width,margin-right] duration-[350ms] ease-in-out',
          hover ? cn(arrowDims.w, 'mr-2.5') : 'w-0'
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
    'font-sans font-medium leading-none tracking-[-0.01em]',
    // Компенсация пустого пространства ascender/descender в line-box Neue Montreal Medium.
    // Без этого визуальный gap между пунктами ощущается больше, чем заданный gap-1.
    '-mt-[0.22em] -mb-[0.32em]',
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
