// Кнопка открытия мобильного меню — серый круг (slate) с «+». Используется в Header, HeroHeader и CatalogToolbar.

import PropTypes from 'prop-types'

import IconButton from './IconButton'
import { Plus } from './icons'

/**
 * Кнопка открытия мобильного меню: серый круг (slate) 48px с иконкой «+».
 *
 * Единый источник для трёх хедеров (Header, HeroHeader, CatalogToolbar) — фиксирует
 * variant/size/ariaLabel/иконку, наружу торчит только onClick.
 *
 * @param {Object} props
 * @param {() => void} props.onClick - Открыть мобильное меню.
 */
export default function MenuOpenButton({ onClick }) {
  return (
    <IconButton variant="slate" size={48} ariaLabel="Открыть меню" onClick={onClick}>
      <Plus />
    </IconButton>
  )
}

MenuOpenButton.propTypes = {
  onClick: PropTypes.func.isRequired,
}
