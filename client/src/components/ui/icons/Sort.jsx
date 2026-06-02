// Иконка сортировки (убывающие линии + стрелка вниз).

import PropTypes from 'prop-types'

import { cn } from '@/utils/cn'

/**
 * Иконка сортировки.
 *
 * @param {object} props
 * @param {number} [props.size=24] - Ширина и высота в пикселях.
 * @param {string} [props.className] - Дополнительные Tailwind-классы.
 * @param {string} [props.ariaLabel] - Если передан — иконка не декоративная.
 */
export default function Sort({ size = 24, className, ariaLabel }) {
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
      <path d="M11 5h10" />
      <path d="M11 9h7" />
      <path d="M11 13h4" />
      <path d="m3 17 3 3 3-3" />
      <path d="M6 18V4" />
    </svg>
  )
}

Sort.propTypes = {
  size: PropTypes.number,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
}
