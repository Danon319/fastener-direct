// Иконка сетки (2×2 скруглённых квадрата). Используется на кнопке «Категории».

import PropTypes from 'prop-types'

import { cn } from '@/utils/cn'

/**
 * Иконка сетки.
 *
 * @param {object} props
 * @param {number} [props.size=24] - Ширина и высота в пикселях.
 * @param {string} [props.className] - Дополнительные Tailwind-классы.
 * @param {string} [props.ariaLabel] - Если передан — иконка не декоративная.
 */
export default function Grid({ size = 24, className, ariaLabel }) {
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
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      {...accessibilityProps}
    >
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  )
}

Grid.propTypes = {
  size: PropTypes.number,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
}
