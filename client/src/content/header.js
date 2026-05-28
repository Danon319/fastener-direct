// Контент шапки: ссылки навигации и метки переключателя языка.

// Ключ языка → отображаемая строка (показывает язык, НА который переключится).
export const LANG_LABELS = {
  ru: 'Russian',
  en: 'English',
}

export const NAV_LINKS = [
  { label: 'Каталог', to: '/catalog' },
  { label: 'Заказы', to: '/orders' },
  { label: 'Корзина', to: '/cart' }, // TODO: маршрут — страница ещё не реализована (этап 6)
  { label: 'О нас', to: '/about' },
]

export const ACCOUNT_LINK = { label: 'Аккаунт', to: '/account' }
