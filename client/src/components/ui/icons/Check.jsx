// Иконка галочки. Используется в чекбоксах фильтров и активной опции сортировки.

import PropTypes from 'prop-types'

import { cn } from '@/utils/cn'

/**
 * Иконка галочки.
 *
 * @param {object} props
 * @param {number} [props.size=24] - Ширина и высота в пикселях.
 * @param {string} [props.className] - Дополнительные Tailwind-классы.
 * @param {string} [props.ariaLabel] - Если передан — иконка не декоративная.
 */
export default function Check({ size = 24, className, ariaLabel }) {
  const accessibilityProps = ariaLabel
    ? { role: 'img', 'aria-label': ariaLabel }
    : { 'aria-hidden': 'true' }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      {...accessibilityProps}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

Check.propTypes = {
  size: PropTypes.number,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
}
