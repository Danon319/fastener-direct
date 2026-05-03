// src/content/header.js
//
// Контент Header / HeroHeader. Тексты nav-pills + lang-switcher.

// Языки lang-switcher.
// Формат: ключ (для useState) → отображаемая строка (что показывает кнопка
// в текущем состоянии — т.е. язык, на который произойдёт переключение,
// прокси-визуальный приём из прототипа).
export const LANG_LABELS = {
  ru: 'Russian',
  en: 'English',
}

// Nav-pills (desktop ≥md и в burger dropdown'е <md).
// `cart` — новый пункт по сравнению с handoff'ом (присутствует в прототипе).
// `account` рендерится с UserIcon перед текстом (red variant).
export const NAV_LINKS = [
  { label: 'Каталог', to: '/catalog' },
  { label: 'Заказы', to: '/orders' },
  { label: 'Корзина', to: '/cart' }, // TODO: route — page not yet built (Phase 6)
  { label: 'О нас', to: '/about' },
]

export const ACCOUNT_LINK = { label: 'Аккаунт', to: '/account' }
