import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { cn } from '@/utils/cn'

import { BrandMark } from './icons'

// Базовые пиксельные размеры марки для пресетов scale.
// md — текущий дефолт (54). sm — ≈80% (43).
const SCALE_DEFAULT_SIZE = { md: 54, sm: 43 }

/**
 * Логотип бренда Fastener Direct с маркой и текстовым блоком.
 *
 * @param {object} props
 * @param {"full"|"mark"} [props.variant="full"] - Полный логотип или только марка.
 * @param {"dark"|"light"} [props.theme="dark"] - Тёмная или светлая тема.
 * @param {number} [props.size] - Размер марки в пикселях (текст масштабируется пропорционально).
 *   Если не задан — берётся из пресета `scale`.
 * @param {"sm"|"md"} [props.scale="md"] - Пресет размера. md=54px (default), sm≈80% (43px).
 *   Игнорируется, если явно задан `size`.
 * @param {() => void} [props.onClick] - Если передан, корневой элемент — кнопка.
 * @param {string} [props.to] - Если задан, рендерит Link вместо div/button.
 * @param {string} [props.className] - Дополнительные Tailwind-классы.
 */
export default function Logo({
  variant = 'full',
  theme = 'dark',
  size,
  scale = 'md',
  onClick,
  to,
  className,
}) {
  const resolvedSize = size ?? SCALE_DEFAULT_SIZE[scale]
  const nameFs = Math.round(resolvedSize * 0.44)
  const subFs = Math.max(6, Math.round(resolvedSize * 0.15))
  const nameLs = Math.max(0.5, resolvedSize * 0.037)
  const subLs = Math.max(1, resolvedSize * 0.056)
  const gap = Math.round(resolvedSize * 0.22)
  const subMt = Math.max(2, Math.round(resolvedSize * 0.11))

  const Tag = to ? Link : onClick ? 'button' : 'div'

  return (
    <Tag
      {...(to ? { to } : {})}
      onClick={onClick}
      style={{ gap: variant === 'mark' ? 0 : gap }}
      className={cn(
        'inline-flex select-none items-center font-sans',
        (onClick || to) && 'cursor-pointer',
        className
      )}
    >
      <BrandMark
        size={resolvedSize}
        className={cn('shrink-0', theme === 'dark' ? 'text-navy' : 'text-white')}
      />

      {variant === 'full' && (
        <div className="flex min-w-0 flex-col overflow-hidden leading-none">
          <div
            style={{ fontSize: nameFs, letterSpacing: nameLs }}
            className={cn('whitespace-nowrap', theme === 'dark' ? 'text-navy' : 'text-white')}
          >
            <span className="font-bold">Fastener </span>
            <span className="font-light">Direct</span>
          </div>
          <div
            style={{ fontSize: subFs, letterSpacing: subLs, marginTop: subMt }}
            className={cn(
              'self-end whitespace-nowrap font-medium',
              theme === 'dark' ? 'text-muted' : 'text-white/50'
            )}
          >
            CORPORATE CONSTRUCT
          </div>
        </div>
      )}
    </Tag>
  )
}

Logo.propTypes = {
  variant: PropTypes.oneOf(['full', 'mark']),
  theme: PropTypes.oneOf(['dark', 'light']),
  size: PropTypes.number,
  scale: PropTypes.oneOf(['sm', 'md']),
  onClick: PropTypes.func,
  to: PropTypes.string,
  className: PropTypes.string,
}
