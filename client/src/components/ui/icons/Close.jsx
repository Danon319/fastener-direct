import PropTypes from 'prop-types'

import { cn } from '@/utils/cn'

/**
 * Иконка закрытия (крестик).
 *
 * Реализация — текстовый символ `×` (U+00D7, MULTIPLICATION SIGN) в `<span>`,
 * не SVG. Парная к `Plus` по визуальному стилю.
 *
 * @param {object} props
 * @param {number} [props.size=24] - Размер бокса и font-size в пикселях.
 * @param {string} [props.className] - Дополнительные Tailwind-классы (цвет приходит сюда от родителя).
 * @param {string} [props.ariaLabel] - Если передан — иконка не декоративная.
 */
export default function Close({ size = 24, className, ariaLabel }) {
  const accessibilityProps = ariaLabel
    ? { role: 'img', 'aria-label': ariaLabel }
    : { 'aria-hidden': 'true' }

  return (
    <span
      style={{ width: size, height: size, fontSize: size, lineHeight: 1 }}
      className={cn('inline-flex select-none items-center justify-center font-sans', className)}
      {...accessibilityProps}
    >
      ×
    </span>
  )
}

Close.propTypes = {
  size: PropTypes.number,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
}
