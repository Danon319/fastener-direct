import React from 'react'
import PropTypes from 'prop-types'

import { cn } from '@/utils/cn'

/**
 * Круглая кнопка-иконка — используется как самостоятельный кликабельный круг
 * (стрелки карусели, кнопки действий).
 *
 * @param {object} props
 * @param {React.ReactNode} props.children          - Иконка (Arrow, Plus, Close и т.д.).
 * @param {() => void} [props.onClick]
 * @param {"light"|"dark"|"filled"} [props.variant="light"]
 * @param {number} [props.size=44]
 * @param {boolean} [props.pressed=false]           - Только для variant="filled" — инвертирует цвета.
 * @param {boolean} [props.interactive=true]        - Если false, нет hover-состояния.
 * @param {boolean} [props.visible=true]            - Если false, скрывается с fade и сдвигом.
 * @param {string} props.ariaLabel                  - ОБЯЗАТЕЛЕН.
 * @param {string} [props.className]
 */
export default function IconButton({
  children,
  onClick,
  variant = 'light',
  size = 44,
  pressed = false,
  interactive = true,
  visible = true,
  ariaLabel,
  className,
}) {
  const iconSize = Math.round(size * 0.36)

  // Цвет иконки зависит от варианта, pressed и interactive
  let iconColorClass
  if (variant === 'light') {
    iconColorClass = interactive ? 'text-slate group-hover/iconbtn:text-white' : 'text-slate'
  } else if (variant === 'dark') {
    iconColorClass = 'text-white'
  } else {
    // filled
    iconColorClass = pressed ? 'text-red' : 'text-white'
  }

  const clonedIcon = React.isValidElement(children)
    ? React.cloneElement(children, { size: iconSize, className: iconColorClass })
    : children

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={!interactive}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
      style={{ width: size, height: size }}
      className={cn(
        'relative flex shrink-0 items-center justify-center overflow-hidden rounded-full',
        'transition-[transform,background-color,border-color,opacity] duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)]',
        'group/iconbtn',
        // Variant base styles
        variant === 'light' && [
          'border-[1.5px] border-[#ddd] bg-transparent',
          interactive && 'hover:border-transparent hover:bg-redHover',
        ],
        variant === 'dark' && [
          'border-[1.5px] border-white/35 bg-transparent',
          interactive && 'hover:border-transparent hover:bg-redHover',
        ],
        variant === 'filled' && [
          'border-0',
          pressed ? 'bg-white' : 'bg-red',
          interactive && 'hover:bg-redHover',
        ],
        // Scale on hover
        interactive && 'hover:scale-[1.18]',
        // Visibility
        visible ? 'translate-x-0 opacity-100' : 'pointer-events-none translate-x-5 opacity-0',
        className
      )}
    >
      {clonedIcon}
    </button>
  )
}

IconButton.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['light', 'dark', 'filled']),
  size: PropTypes.number,
  pressed: PropTypes.bool,
  interactive: PropTypes.bool,
  visible: PropTypes.bool,
  ariaLabel: PropTypes.string.isRequired,
  className: PropTypes.string,
}
