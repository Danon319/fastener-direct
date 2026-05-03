// src/content/menu.js
//
// Контент MobileMenu (fullscreen overlay).
// Эти пункты — НЕ те же что в Header. Это пункты, которых в Header нет:
// разделы для специфичных аудиторий и UI-настройки.

// Primary items — крупные nav-items с выезжающей стрелкой.
// Routes — placeholders. После Phase 6 заменить на реальные.
export const MENU_PRIMARY = [
  { label: 'Помощь', to: '/help' }, // TODO: route — page not yet built
  { label: 'Производителям', to: '/sellers' }, // TODO: route — page not yet built
  { label: 'Связь', to: '/contacts' }, // ведёт на /contacts (есть в Footer)
  { label: 'О производителях', to: '/manufacturers' }, // TODO: route — page not yet built
]

// Secondary items — UI-переключатели (тема / город). НЕ ссылки.
// onClick делается no-op в Phase 3 (// TODO: i18n / // TODO: theme switcher).
export const MENU_SECONDARY = [
  { label: 'Тема' }, // TODO: theme switcher (after Phase 6)
  { label: 'Город' }, // TODO: i18n / city selector (after Phase 6)
]

// CTA-кнопка в нижней правой части меню.
export const MENU_CTA = {
  label: 'Связаться',
  to: '/contacts',
}
