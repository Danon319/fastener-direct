// Pill-кнопка навигации для Header и HeroHeader. Поддерживает варианты оформления, Link и button.
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { cn } from '@/utils/cn'

// Классы оформления для четырёх вариантов pill-кнопки.
const VARIANT_CLASSES = {
  default: 'bg-transparent text-navy hover:bg-pillHover',
  heroWhite: 'bg-white text-navy hover:bg-pillHover',
  heroLang: 'bg-transparent text-white border border-white hover:bg-white hover:text-navy',
  red: 'bg-red text-white hover:bg-redHover',
}

/**
 * Pill-кнопка навигации (Header/HeroHeader).
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {"default"|"heroWhite"|"heroLang"|"red"} [props.variant="default"]
 * @param {string} [props.to] - Если задан, рендерит <Link>.
 * @param {() => void} [props.onClick]
 * @param {string} [props.className]
 * @param {string} [props.ariaLabel]
 */
function NavPill({ children, variant = 'default', to, onClick, className, ariaLabel, ...rest }) {
  const classes = cn(
    'inline-flex items-center gap-1.5 rounded-3xl whitespace-nowrap font-medium font-sans cursor-pointer',
    'px-3.5 py-2 text-xs md:px-5 md:py-2.5 md:text-sm',
    'transition-colors duration-200',
    VARIANT_CLASSES[variant],
    className
  )

  if (to) {
    return (
      <Link to={to} onClick={onClick} className={classes} aria-label={ariaLabel} {...rest}>
        {children}
      </Link>
    )
  }
  return (
    <button type="button" onClick={onClick} className={classes} aria-label={ariaLabel} {...rest}>
      {children}
    </button>
  )
}

NavPill.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'heroWhite', 'heroLang', 'red']),
  to: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
}

export default NavPill
