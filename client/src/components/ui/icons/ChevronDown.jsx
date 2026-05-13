import PropTypes from 'prop-types'

import { cn } from '@/utils/cn'

export default function ChevronDown({ size = 24, className, ariaLabel }) {
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
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

ChevronDown.propTypes = {
  size: PropTypes.number,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
}
