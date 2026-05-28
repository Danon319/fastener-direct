// Иконка ВКонтакте для Footer.

import PropTypes from 'prop-types'

import { cn } from '@/utils/cn'

/**
 * Иконка ВКонтакте.
 *
 * @param {object} props
 * @param {number} [props.size=24] - Ширина и высота в пикселях.
 * @param {string} [props.className] - Дополнительные Tailwind-классы.
 * @param {string} [props.ariaLabel] - Если передан — иконка не декоративная.
 */
export default function VK({ size = 24, className, ariaLabel }) {
  const accessibilityProps = ariaLabel
    ? { role: 'img', 'aria-label': ariaLabel }
    : { 'aria-hidden': 'true' }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      {...accessibilityProps}
    >
      <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.587-1.496c.598-.189 1.366 1.26 2.18 1.817.616.422 1.084.33 1.084.33l2.178-.03s1.14-.07.599-.964c-.044-.073-.314-.661-1.618-1.869-1.366-1.265-1.183-1.06.462-3.248.999-1.33 1.398-2.142 1.273-2.49-.12-.331-.856-.244-.856-.244l-2.453.015s-.182-.025-.317.056c-.132.079-.216.263-.216.263s-.39 1.038-.908 1.92c-1.096 1.867-1.534 1.965-1.713 1.849-.417-.271-.313-1.087-.313-1.666 0-1.81.275-2.564-.533-2.76-.268-.065-.466-.108-1.154-.115-.88-.01-1.626.003-2.048.21-.281.137-.498.443-.366.46.163.022.532.1.728.365.253.342.244 1.108.244 1.108s.145 2.13-.34 2.394c-.332.18-.788-.188-1.767-1.874-.502-.864-.88-1.818-.88-1.818s-.073-.179-.203-.275c-.158-.117-.378-.154-.378-.154l-2.332.015s-.35.01-.478.162c-.114.135-.009.414-.009.414s1.83 4.282 3.903 6.442c1.9 1.98 4.058 1.85 4.058 1.85h.978z" />
    </svg>
  )
}

VK.propTypes = {
  size: PropTypes.number,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
}
