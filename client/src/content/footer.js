// src/content/footer.js
//
// Контент секции подвала. Реальные тексты взяты из прототипа footer-section.jsx.
// Плейсхолдеры контактных данных и маршрутов помечены // TODO.

// Каталог-категории.
// Все три ведут на /catalog. Это намеренно — конкретный вложенный путь и параметры строки запроса
// будут добавлены после этапа 6, когда страница каталога обретёт фильтры.
export const CATALOG_LINKS = [
  { label: 'Строительный крепёж', to: '/catalog' },
  { label: 'Метизы', to: '/catalog' },
  { label: 'Спецкрепёж', to: '/catalog' },
]

// Навигация по сайту.
export const NAV_LINKS = [
  { label: 'Заказы', to: '/orders' },
  { label: 'Доставка', to: '/delivery' }, // TODO: маршрут — страница ещё не реализована (этап 6)
  { label: 'О нас', to: '/about' },
  { label: 'Контакты', to: '/contacts' },
]

// Реквизиты.
// TODO: реальные контакты — заменить на реальные после получения от заказчика.
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
// TODO: ссылки на соцсети — заменить на реальные после получения от заказчика.
export const SOCIAL_LINKS = {
  youtube: '#',
  vk: '#',
}

// Блок призыва к действию.
export const FOOTER_CTA = {
  heading: 'Есть вопрос, проблема ?',
  contactsLabel: 'Контакты',
  buttonLabel: 'Связаться',
  buttonTo: '/contacts',
}

// Нижняя полоса.
export const FOOTER_LEGAL = {
  documentsLabel: 'Документы',
  documentsTo: '/privacy',
}
