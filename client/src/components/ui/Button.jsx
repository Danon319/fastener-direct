import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { cn } from '@/utils/cn'

import { Arrow } from './icons'

const SIZE_MAP = {
  sm: {
    button: 'w-[140px] h-[56px] text-[13px] pl-[20px] pr-[9px]',
    circle: 'w-[38px] h-[38px]',
    arrow: 14,
  },
  md: {
    button: 'w-[161px] h-[66px] text-[15px] pl-[24px] pr-[11px]',
    circle: 'w-[44px] h-[44px]',
    arrow: 16,
  },
  lg: {
    button: 'w-[200px] h-[78px] text-[17px] pl-[30px] pr-[14px]',
    circle: 'w-[56px] h-[56px]',

    arrow: 20,
  },
}

/**
 * Основная CTA-кнопка в форме таблетки с анимированным красным кругом и стрелкой.
 *
 * @param {object} props
 * @param {React.ReactNode} [props.children]
 * @param {string} [props.text="Связаться"] - Текст кнопки, если children не передан.
 * @param {() => void} [props.onClick]
 * @param {"sm"|"md"|"lg"} [props.size="md"] - Размер кнопки.
 * @param {string} [props.className] - Дополнительные Tailwind-классы.
 * @param {string} [props.ariaLabel] - Метка доступности для кнопки.
 * @param {"button"|"submit"|"reset"} [props.type="button"] - Тип кнопки.
 * @param {string} [props.to] - Если задан, рендерит Link вместо button.
 * @param {boolean} [props.disabled] - Отключает кнопку.
 */
export default function Button({
  children,
  text = 'Связаться',
  onClick,
  size = 'md',
  className,
  ariaLabel,
  type = 'button',
  to,
  disabled,
  ...rest
}) {
  const { button: buttonSize, circle: circleSize, arrow: arrowSize } = SIZE_MAP[size]

  const baseCn = cn(
    'inline-flex cursor-pointer select-none items-center justify-between rounded-full border-0 bg-white font-sans font-medium text-navy',
    '[box-shadow:0_2px_14px_rgba(0,0,0,0.12)]',
    'group/btn',
    buttonSize,
    className
  )

  const circle = (
    <span
      className={cn(
        'relative shrink-0 overflow-hidden rounded-full border-[1.5px] border-white/35 bg-red',
        'transition-[transform,background-color,border-color] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
        'group-hover/btn:scale-[1.18] group-hover/btn:border-transparent group-hover/btn:bg-redHover',
        circleSize
      )}
    >
      {/* Стрелка 1: видна в покое, уходит вправо с блюром при наведении */}
      <span
        className={cn(
          'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
          'transition-[transform,filter,opacity] duration-[220ms] ease-[cubic-bezier(0.55,0,0.9,0.4)]',
          'group-hover/btn:translate-x-[150%] group-hover/btn:opacity-0 group-hover/btn:blur-[3px]'
        )}
      >
        <Arrow size={arrowSize} className="text-white" />
      </span>

      {/* Стрелка 2: скрыта слева в покое, выезжает в центр при наведении */}
      <span
        className={cn(
          'absolute left-1/2 top-1/2 -translate-x-[250%] -translate-y-1/2',
          'transition-transform duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)]',
          'group-hover/btn:-translate-x-1/2'
        )}
      >
        <Arrow size={arrowSize} className="text-white" />
      </span>
    </span>
  )

  if (to) {
    return (
      <Link
        to={to}
        aria-label={ariaLabel}
        aria-disabled={disabled ? 'true' : undefined}
        onClick={
          onClick
            ? (e) => {
                e.stopPropagation()
                onClick()
              }
            : undefined
        }
        className={cn(baseCn, disabled && 'pointer-events-none opacity-50')}
        {...rest}
      >
        <span>{children ?? text}</span>
        {circle}
      </Link>
    )
  }

  return (
    <button
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
      className={cn(baseCn, 'disabled:cursor-not-allowed disabled:opacity-50')}
      {...rest}
    >
      <span>{children ?? text}</span>
      {circle}
    </button>
  )
}

Button.propTypes = {
  children: PropTypes.node,
  text: PropTypes.string,
  onClick: PropTypes.func,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  to: PropTypes.string,
  disabled: PropTypes.bool,
}
