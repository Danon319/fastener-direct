// src/components/ui/NavPill.jsx
//
// Pill-кнопка для Header и HeroHeader.
// 4 variants:
//   - default   — Header (белый pill state): прозрачный, hover серый.
//   - heroWhite — HeroHeader: белый фон, hover серый.
//   - heroLang  — HeroHeader lang-switcher: прозрачный с белой обводкой.
//   - red       — кнопка "Аккаунт" (с UserIcon): красный фон, hover redHover.
//
// Поддерживает optional `to` (Link) или `onClick` (button). Если задан `to`,
// рендерит <Link>, иначе <button>.
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { cn } from '@/utils/cn'

const VARIANT_CLASSES = {
  default: 'bg-transparent text-navy hover:bg-[#cccccc]',
  heroWhite: 'bg-white text-navy hover:bg-[#cccccc]',
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
    'px-3 py-1.5 text-xs md:px-4 md:py-2 md:text-sm',
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
