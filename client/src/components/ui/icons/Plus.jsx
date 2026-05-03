import PropTypes from 'prop-types'

import { cn } from '@/utils/cn'

/**
 * Иконка плюса (открыть меню / добавление).
 *
 * Реализация — текстовый символ `+` в `<span>`, не SVG.
 * Это даёт более «лёгкий» рендер с естественной типографикой шрифта,
 * скруглённые концы получаются автоматически (зависит от шрифта),
 * и размер задаётся через font-size.
 *
 * @param {object} props
 * @param {number} [props.size=24] - Размер бокса и font-size в пикселях.
 * @param {string} [props.className] - Дополнительные Tailwind-классы (цвет приходит сюда от родителя).
 * @param {string} [props.ariaLabel] - Если передан — иконка не декоративная.
 */
export default function Plus({ size = 24, className, ariaLabel }) {
  const accessibilityProps = ariaLabel
    ? { role: 'img', 'aria-label': ariaLabel }
    : { 'aria-hidden': 'true' }

  return (
    <span
      style={{ width: size, height: size, fontSize: size, lineHeight: 1 }}
      className={cn(
        'inline-flex select-none items-center justify-center font-sans',
        className
      )}
      {...accessibilityProps}
    >
      +
    </span>
  )
}

Plus.propTypes = {
  size: PropTypes.number,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
}
