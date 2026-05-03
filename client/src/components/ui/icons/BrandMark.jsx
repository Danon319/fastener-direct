import PropTypes from 'prop-types'

import { cn } from '@/utils/cn'

/**
 * Логотип-марка бренда (Pomerium-форма из public/logo/pomerium.svg).
 *
 * @param {object} props
 * @param {number} [props.size=40] - Ширина и высота в пикселях.
 * @param {string} [props.className] - Дополнительные Tailwind-классы.
 * @param {string} [props.ariaLabel] - Если передан — иконка не декоративная.
 */
export default function BrandMark({ size = 40, className, ariaLabel }) {
  const accessibilityProps = ariaLabel
    ? { role: 'img', 'aria-label': ariaLabel }
    : { 'aria-hidden': 'true' }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      {...accessibilityProps}
    >
      <path
        fill="currentColor"
        d="M0 6.768v2.338l.038-.005A2.832 2.832 0 0 1 3.2 11.913v7.998h2.318v-9.023A2.687 2.687 0 0 1 7.95 8.213c1.288-.123 2.345.873 2.345 2.167v9.53h2.317v-9.265c0-1.685 1.271-3.1 2.948-3.281 1.565-.169 2.922 1.085 2.922 2.66v9.886H20.8v-9.875A3.635 3.635 0 0 1 24 6.422V4.089z"
      />
    </svg>
  )
}

BrandMark.propTypes = {
  size: PropTypes.number,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
}
