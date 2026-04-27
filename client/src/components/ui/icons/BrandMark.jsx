import PropTypes from 'prop-types'

import { cn } from '@/utils/cn'

/**
 * Логотип-марка бренда, извлечённый из knime.svg.
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
        d="m10.445 21.393 11.54-.775.451.775zM7.56 11.113l-5.092 10.28h-.904Zm10.427 2.652-6.43-9.505.452-.775zm2.57 5.216.627.896-10.652.707zM4.655 20.976l-1.143.09 4.709-9.488Zm6.173-14.667.476-.998 5.984 8.782zm8.272 11.055.847 1.015-8.685 1.413zM6.76 20.532l-1.32.224 3.11-8.162Zm3.406-12.189.472-1.207 5.558 6.732Zm7.403 7.54 1.13 1.016-6.378 1.98zm-8.759 4.08-1.46.448 1.46-6.44zm.8-9.539.363-1.48 4.868 4.477zm-.348 9.402v-7.851l.244-1.085 6.864 3.926.834.758L10.34 19.5zM12.01 1.694 0 22.306h24z"
      />
    </svg>
  )
}

BrandMark.propTypes = {
  size: PropTypes.number,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
}
