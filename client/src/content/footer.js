// src/content/footer.js
//
// Контент Footer-секции. Реальные тексты взяты из прототипа footer-section.jsx.
// Плейсхолдеры контактных данных и роутов помечены // TODO.

// Каталог-категории.
// Все три ведут на /catalog. Это намеренно — конкретный subpath/query будет
// добавлен после Phase 6, когда страница каталога обретёт фильтры.
export const CATALOG_LINKS = [
  { label: 'Строительный крепёж', to: '/catalog' },
  { label: 'Метизы', to: '/catalog' },
  { label: 'Спецкрепёж', to: '/catalog' },
]

// Site-навигация.
export const NAV_LINKS = [
  { label: 'Заказы', to: '/orders' },
  { label: 'Доставка', to: '/delivery' }, // TODO: route — page not yet built (Phase 6)
  { label: 'О нас', to: '/about' },
  { label: 'Контакты', to: '/contacts' },
]

// Реквизиты.
// TODO: real contact — заменить на реальные после получения от заказчика.
export const CONTACT_INFO = {
  email: 'info@fastenerdirect.ru',
  emailHref: 'mailto:info@fastenerdirect.ru',
  phone: '+7 (XXX) XXX-XX-XX',
  phoneHref: 'tel:+7XXXXXXXXXX',
  cityLine: 'г. Москва',
  streetLine: 'ул. XXXXXXX, д. XX',
  mapHref: 'https://yandex.ru/maps/?text=Москва, ул. XXXXXXX, д. XX',
}

// Соцсети.
// TODO: social link — заменить на реальные после получения от заказчика.
export const SOCIAL_LINKS = {
  youtube: '#',
  vk: '#',
}

// CTA-блок.
export const FOOTER_CTA = {
  heading: 'Есть вопрос, проблема ?',
  contactsLabel: 'Контакты',
  buttonLabel: 'Связаться',
  buttonTo: '/contacts',
}

// Bottom bar.
export const FOOTER_LEGAL = {
  documentsLabel: 'Документы',
  documentsTo: '/privacy',
}
