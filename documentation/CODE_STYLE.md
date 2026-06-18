# Fastener Direct — Code Style Guide

Эталон написания кода для всего проекта. Обязательное чтение перед началом работы с любым файлом.

**Главные цели проекта:** высокая скорость разработки + высокий уровень работоспособности. Все правила ниже служат этим двум целям.

---

## 0. Технологический контракт

Используем ТОЛЬКО:
- **React 19** (функциональные компоненты + хуки)
- **Tailwind CSS v3** (классы из официальной документации)
- **Motion (импорт `from "motion/react"`)** (задокументированные API)
- **React Router v7**
- **Zustand** (для глобального стейта)
- **JavaScript (.jsx)** — без TypeScript

Запрещено без явного подтверждения: любые UI-библиотеки, CSS-in-JS, классовые компоненты, HOC-обёртки без необходимости.

---

## 1. Структура файла компонента

**Порядок блоков сверху вниз:**

1. Импорты (порядок строгий — см. §3)
2. Локальные константы (вне компонента)
3. Локальные подкомпоненты (если есть, см. §7)
4. JSDoc главного компонента
5. Главный компонент (`export default function`)
6. Вспомогательные хелперы (если нужны только в этом файле)

### Эталонный пример

```jsx
// 1. Импорты
import { useState } from 'react'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'

import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'

// 2. Локальные константы
const ANIMATION_DURATION = 0.6

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

// 3. Локальный подкомпонент (используется только внутри этой секции)
function FeatureIcon({ icon: Icon }) {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
      <Icon className="h-6 w-6 text-accent" />
    </div>
  )
}

FeatureIcon.propTypes = {
  icon: PropTypes.elementType.isRequired,
}

// 4. JSDoc главного компонента
/**
 * Секция с преимуществами на главной странице.
 *
 * @param {Object} props
 * @param {string} props.title - Заголовок секции.
 * @param {Array<{id: string, title: string, description: string, icon: React.ElementType}>} props.features - Массив карточек.
 * @param {string} [props.className] - Доп. классы для корневого элемента.
 */
export default function FeatureSection({ title, features, className }) {
  const [activeId, setActiveId] = useState(null)

  return (
    <section className={cn('py-20 px-4 md:px-8 lg:px-16', className)}>
      <h2 className="mb-12 text-3xl font-medium text-navy md:text-4xl lg:text-5xl">
        {title}
      </h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <motion.article
            key={feature.id}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: ANIMATION_DURATION }}
            onMouseEnter={() => setActiveId(feature.id)}
            onMouseLeave={() => setActiveId(null)}
            className="rounded-2xl bg-slate p-6 transition-colors hover:bg-slate-hover"
          >
            <FeatureIcon icon={feature.icon} />
            <h3 className="mt-4 text-xl font-medium text-white">{feature.title}</h3>
            <p className="mt-2 text-sm text-muted">{feature.description}</p>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

FeatureSection.propTypes = {
  title: PropTypes.string.isRequired,
  features: PropTypes.array.isRequired,
  className: PropTypes.string,
}
```

---

## 2. Именование

| Сущность | Правило | Пример |
|---|---|---|
| Файл компонента | `PascalCase.jsx` | `HeroSection.jsx` |
| Файл хука | `camelCase.js` с префиксом `use` | `useScrollDirection.js` |
| Файл утилиты | `camelCase.js` | `formatPrice.js` |
| Компонент | `PascalCase` | `function HeroSection()` |
| Хук | `use` + `camelCase` | `useScrollDirection` |
| Функция / переменная | `camelCase` | `handleClick`, `isOpen` |
| Булевы значения | префикс `is` / `has` / `should` | `isOpen`, `hasError` |
| Обработчики событий | `handle` + Event | `handleClick`, `handleSubmit` |
| Пропсы-коллбэки | `on` + Event | `onClose`, `onSubmit` |
| Константы (модульные) | `SCREAMING_SNAKE_CASE` | `MAX_ITEMS`, `API_BASE` |
| CSS-классы | только Tailwind | `bg-accent text-white` |

---

## 3. Импорты и экспорты

### 3.1 Alias через Vite

В `vite.config.js` настраиваем алиас `@/` → `./src`:

```js
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
```

После этого вместо `../../components/ui/Button` пишем `@/components/ui/Button`.

### 3.2 Порядок импортов

Разделяем группы пустой строкой:

```jsx
// 1. Внешние пакеты (react, react-router-dom, framer-motion и т.д.)
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

// 2. Абсолютные импорты (через alias @/)
import { Button } from '@/components/ui/Button'
import { useScrollDirection } from '@/hooks/useScrollDirection'
import { cn } from '@/utils/cn'

// 3. Относительные импорты (только внутри одной фичи)
import { HeroTitle } from './HeroTitle'

// 4. Стили (если нужны отдельно, обычно не нужны)
import './HeroSection.css'

// 5. Ассеты
import logo from '@/assets/logo.svg'
```

### 3.3 Экспорт

Главный компонент файла:
```jsx
export default function ComponentName() { ... }
```

Переиспользуемые утилиты/подкомпоненты:
```jsx
export function helperName() { ... }
export const CONSTANT = 42
```

**Не использовать** `default export` для утилит — только именованный.

---

## 4. Tailwind CSS — правила

### 4.1 Базовое правило

Основа — Tailwind-классы. Inline-стили **только** когда:
- Значение вычисляется динамически и не сводится к классам (например, `transform: translate(${x}px, ${y}px)` где x/y приходят из стейта).
- Нужны CSS-свойства, которых нет в Tailwind по умолчанию (редкие случаи).

Если inline-стиль можно заменить классом — всегда класс.

### 4.2 Утилита `cn` для условных классов

Создаём `src/utils/cn.js`:

```js
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Объединяет классы Tailwind, правильно разруливая конфликты (например, `p-2` и `p-4`).
 *
 * @param {...any} inputs - Классы, объекты, массивы, falsy-значения.
 * @returns {string}
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
```

Требует установки:
```bash
npm install clsx tailwind-merge
```

Использование:
```jsx
<div className={cn('px-4 py-2', isActive && 'bg-accent text-white', className)} />
```

### 4.3 Порядок классов (рекомендация)

Можно использовать плагин `prettier-plugin-tailwindcss` — он автоматически сортирует классы. Если руками — примерный порядок:

1. Layout (`flex`, `grid`, `block`)
2. Positioning (`absolute`, `top-0`)
3. Sizing (`w-full`, `h-12`)
4. Spacing (`px-4`, `py-2`, `gap-4`)
5. Typography (`text-lg`, `font-medium`)
6. Colors (`bg-accent`, `text-white`)
7. Effects (`shadow-lg`, `opacity-80`)
8. Transitions (`transition-colors`, `duration-300`)
9. Responsive (`md:px-8`, `lg:text-xl`)
10. State (`hover:bg-accent-hover`, `focus:outline-none`)

### 4.4 Длинные className — многострочный формат

Если классов много, разбиваем через шаблонные строки:
```jsx
<button
  className={cn(
    'inline-flex items-center gap-2 px-4 py-2',
    'rounded-full bg-accent text-white',
    'transition-colors hover:bg-accent-hover',
    isDisabled && 'opacity-50 pointer-events-none'
  )}
>
```

---

## 5. Адаптив

**Подход: mobile-first + стандартные Tailwind breakpoints.**

| Brkpt | px | Применение |
|---|---|---|
| (base) | <640 | Мобильные |
| `sm:` | ≥640 | Большие мобильные / планшеты в портрете |
| `md:` | ≥768 | Планшеты в ландшафте |
| `lg:` | ≥1024 | Ноутбуки |
| `xl:` | ≥1280 | Десктопы |
| `2xl:` | ≥1536 | Большие мониторы |

Писать базовые классы для мобильной, добавлять `md:` / `lg:` / `xl:` для более крупных экранов:

```jsx
<div className="px-4 py-8 md:px-8 md:py-12 lg:px-16 lg:py-20">
```

**Не использовать** inline-таблицы `R[vp.bp]` из прототипа — они хорошо работали для single-file проектов, но в нашей архитектуре усложняют поддержку.

---

## 6. Motion — разрешённые API

Используем **только эти** props и компоненты:

| API | Назначение |
|---|---|
| `motion.div`, `motion.section`, `motion.button` и т.д. | Анимируемые элементы |
| `initial` | Начальное состояние |
| `animate` | Целевое состояние |
| `exit` | Состояние при удалении (внутри `AnimatePresence`) |
| `variants` | Именованные состояния |
| `transition` | Параметры анимации |
| `whileHover` | Состояние при наведении |
| `whileTap` | Состояние при нажатии |
| `whileInView` | Анимация при появлении в viewport |
| `viewport` | Настройки `whileInView` (`once`, `amount`) |
| `AnimatePresence` | Анимация размонтирования |
| `useScroll`, `useTransform`, `useSpring`, `useVelocity`, `useReducedMotion`, `useMotionValue`, `useMotionValueEvent`, `animate`, `useInView` | Скролл-анимации и motion-values (расширение whitelist для секций OurValues, Hero, FastenerDiagram) |

Если нужно что-то вне этого списка — флагни и спроси. **Не выдумывать** props.

### 6.1 Variants — вынос за компонент

```jsx
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function Block() {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      ...
    </motion.div>
  )
}
```

### 6.2 Stagger для списков

```jsx
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

<motion.ul variants={containerVariants} initial="hidden" animate="visible">
  {items.map((item) => (
    <motion.li key={item.id} variants={itemVariants}>
      {item.text}
    </motion.li>
  ))}
</motion.ul>
```

### 6.3 AnimatePresence

```jsx
<AnimatePresence mode="wait">
  {isOpen && (
    <motion.div
      key="modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      ...
    </motion.div>
  )}
</AnimatePresence>
```

Каждый дочерний элемент `AnimatePresence` **обязан иметь `key`**.

---

## 7. Подкомпоненты — где живут

### Правило

- **Используется только в одном файле-секции** → локальный подкомпонент в том же файле (над главным компонентом).
- **Используется в 2+ местах** → выносим в `components/ui/` (если это визуальный примитив) или в `components/sections/` (если это секция лендинга).

### Примеры

- Кнопка `Button` — используется везде → `components/ui/Button.jsx`
- Логотип `Logo` — используется в Header и Footer → `components/ui/Logo.jsx`
- `FeatureIcon` — только внутри `FeatureSection` → локально в `FeatureSection.jsx`
- `NavPill` — только внутри `Header` → локально в `Header.jsx`

### Когда выносить

Если локальный подкомпонент перевалил за ~40 строк или содержит сложную логику — выносим в отдельный файл рядом с секцией:

```
components/sections/Hero/
├── HeroSection.jsx     # главный компонент
├── HeroTitle.jsx       # вынесенный большой подкомпонент
└── HeroBackground.jsx
```

---

## 8. Шрифты и ассеты

### 8.1 Шрифты

Файлы шрифтов → `client/public/fonts/`. Подключение — один раз в `src/styles/index.css`:

```css
@font-face {
  font-family: 'Neue Montreal';
  src: url('/fonts/NeueMontreal-Medium.woff2') format('woff2');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@tailwind base;
@tailwind components;
@tailwind utilities;
```

В `tailwind.config.js`:
```js
theme: {
  extend: {
    fontFamily: {
      sans: ['"Neue Montreal"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
    },
  },
}
```

**Не использовать** base64-инжект через `useEffect` — это паттерн из прототипа, в production коде он плох (FOUT, лишний JS в рантайме).

### 8.2 Изображения / иконки / видео

- Декоративные и статичные (логотип, иконки, фоновые видео) → `client/public/` → импортируются по публичному URL (`/images/hero.jpg`).
- Иконки как компоненты — лучше вынести в `components/ui/icons/` и импортировать как React-компоненты.
- Пользовательский контент → S3, URL приходит из API.

---

## 9. Хуки

### Правила

- Кастомные хуки живут в `src/hooks/`.
- Один файл — один хук.
- Всегда начинаются с `use`.
- JSDoc обязателен.
- Возвращают либо одно значение, либо кортеж `[value, setValue]`, либо объект (если 3+ значений).

### Эталон

```jsx
// src/hooks/useScrollDirection.js
import { useEffect, useState } from 'react'

/**
 * Отслеживает направление скролла страницы.
 * Полезно для скрытия/показа шапки при скролле.
 *
 * @param {number} [threshold=10] - Минимальная дельта в пикселях для смены направления.
 * @returns {'up' | 'down' | null} - Направление скролла или null, если ещё не определено.
 */
export function useScrollDirection(threshold = 10) {
  const [direction, setDirection] = useState(null)

  useEffect(() => {
    let lastY = window.scrollY

    const handleScroll = () => {
      const currentY = window.scrollY
      if (Math.abs(currentY - lastY) < threshold) return
      setDirection(currentY > lastY ? 'down' : 'up')
      lastY = currentY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold])

  return direction
}
```

---

## 10. Zustand — структура store

### 10.1 Общая структура

Один стор на фичу. Каждый слайс — самостоятельный стор, созданный своим `create()`; `index.js` — barrel, реэкспортирующий их под единой точкой входа `@/store`:

```
src/store/
├── index.js              # barrel: реэкспорт всех сторов
├── slices/
│   ├── uiSlice.js        # useUiStore
│   ├── cartSlice.js      # useCartStore
│   └── favoritesSlice.js # useFavoritesStore
```

**Почему отдельные сторы, а не один общий.** Сторы фич изолированы и не конфликтуют по именам полей (например, и `cartSlice`, и `favoritesSlice` держат состояние под ключом `items` — Map vs Set; в едином сторе они бы столкнулись). Подписка идёт только на нужный стор, лишних ререндеров меньше.

### 10.2 Пример слайса

```js
// src/store/slices/cartSlice.js
import { create } from 'zustand'

export const useCartStore = create((set, get) => ({
  items: new Map(), // productId → количество

  addToCart: (productId, quantity = 1) =>
    set((state) => {
      const next = new Map(state.items)
      next.set(productId, quantity)
      return { items: next }
    }),

  isInCart: (productId) => get().items.has(productId),
}))
```

### 10.3 Barrel

```js
// src/store/index.js
export { useUiStore } from './slices/uiSlice'
export { useCartStore } from './slices/cartSlice'
export { useFavoritesStore } from './slices/favoritesSlice'
```

Импортируем сторы из `@/store`, а не из `./slices/*` напрямую:

```jsx
import { useCartStore, useFavoritesStore } from '@/store'
```

### 10.4 Использование

Всегда выбираем нужные поля точечно — иначе компонент перерендерится при любом изменении стора:

```jsx
// ✅ Хорошо
const addToCart = useCartStore((state) => state.addToCart)
const isMenuOpen = useUiStore((state) => state.isMenuOpen)

// ❌ Плохо — перерисует при любом изменении
const { addToCart } = useCartStore()
```

---

## 11. JSDoc — обязательный минимум

### 11.1 Компоненты

```jsx
/**
 * Краткое описание компонента в одно предложение.
 *
 * При необходимости — второй абзац с деталями: когда использовать, какие нюансы.
 *
 * @param {Object} props
 * @param {string} props.title - Заголовок.
 * @param {Array<Product>} props.items - Список товаров.
 * @param {() => void} [props.onClose] - Коллбэк при закрытии (опциональный).
 * @param {string} [props.className] - Доп. классы для корневого элемента.
 */
export default function ProductList({ title, items, onClose, className }) { ... }
```

### 11.2 Функции и хуки

```jsx
/**
 * Форматирует цену в рублях с разделителями разрядов.
 *
 * @param {number} price - Цена в копейках.
 * @returns {string} - Отформатированная строка, например "1 299 ₽".
 */
export function formatPrice(price) { ... }
```

### 11.3 Сложные типы — через `@typedef`

Если один и тот же тип используется в нескольких местах, объявляем его один раз:

```jsx
/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} title
 * @property {number} price
 * @property {string[]} images
 */
```

Потом ссылаемся: `@param {Product[]} products`.

---

## 12. Комментарии в коде

### Правила

- **Язык: русский.** JSDoc-описания тоже на русском.
- Комментируем только сложные места: нетривиальную логику, неочевидные оптимизации, workaround'ы.
- **Не комментируем очевидное** (`// увеличиваем счётчик`).
- Если что-то можно не комментировать, а сделать код самоочевидным через имя переменной — делаем так.

### Примеры

```jsx
// ✅ Хорошо — объясняет почему, а не что
// Задержка 350мс нужна чтобы дождаться завершения blur-анимации
// перед сменой текста, иначе старый и новый текст мерцают.
setTimeout(() => setText(nextText), 350)

// ❌ Плохо — очевидно из кода
// Устанавливаем текст через 350 мс
setTimeout(() => setText(nextText), 350)
```

### TODO / FIXME / NOTE

```jsx
// TODO: заменить на API-вызов когда бэк будет готов
// FIXME: на iOS Safari скролл иногда дёргается
// NOTE: этот useEffect должен быть до useLayoutEffect выше, порядок важен
```

---

## 13. PropTypes

Используем пакет `prop-types` для основных пропсов. Дополняет JSDoc — JSDoc помогает IDE и чтению, PropTypes ловит ошибки в рантайме (в dev-режиме).

```jsx
import PropTypes from 'prop-types'

export default function Button({ variant, size, children, onClick }) { ... }

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'ghost']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
}

Button.defaultProps = {
  variant: 'primary',
  size: 'md',
}
```

Если компонент простой (2-3 пропса, всё очевидно) — можно ограничиться JSDoc.

---

## 14. Работа с API (fetch)

Обёртки для API-запросов живут в `src/api/`. Один файл — один домен:

```
src/api/
├── client.js       # базовая обёртка fetch
├── products.js
├── orders.js
└── auth.js
```

### 14.1 Базовая обёртка

```js
// src/api/client.js

/**
 * Обёртка над fetch с базовым URL и обработкой ошибок.
 *
 * @param {string} endpoint - Путь запроса (например, '/products').
 * @param {RequestInit} [options] - Опции fetch.
 * @returns {Promise<any>}
 */
export async function apiClient(endpoint, options = {}) {
  const response = await fetch(`/api${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`API error ${response.status}: ${response.statusText}`)
  }

  return response.json()
}
```

### 14.2 Домен

```js
// src/api/products.js
import { apiClient } from './client'

export const productsApi = {
  list: () => apiClient('/products'),
  getById: (id) => apiClient(`/products/${id}`),
  create: (data) => apiClient('/products', { method: 'POST', body: JSON.stringify(data) }),
}
```

---

## 15. Антипаттерны — чего НЕ делаем

- ❌ **Длинные компоненты (>250 строк).** Если файл разросся — разбиваем на подкомпоненты.
- ❌ **Магические числа в коде.** `500`, `0.35` → выносим в именованные константы.
- ❌ **Глубокая вложенность JSX (>4 уровней).** Если вложено глубже — выносим в подкомпонент.
- ❌ **Хардкод строк в JSX, которые пойдут в контент.** Выносим в константы или пропсы.
- ❌ **Повторный fetch одних и тех же данных в соседних компонентах.** Поднимаем в родителя или в Zustand.
- ❌ **Мутации состояния.** `state.items.push(x)` → только `set({ items: [...state.items, x] })`.
- ❌ **Отсутствие `key` в списках.** Key должен быть стабильным (id, не index, если список может перестраиваться).
- ❌ **`any`-уровень пропсов без JSDoc.** Если не понял, какой тип у пропа — спроси автора или прочитай источник, не додумывай.
- ❌ **Inline-функции в `useEffect`-зависимостях без `useCallback`.** Бесконечный ререндер.
- ❌ **Смешивание Tailwind и inline-стилей без причины.** Tailwind — основа, inline — только экстраординарные случаи.

---

## 16. Чек-лист перед коммитом

- [ ] Файл назван `PascalCase.jsx` (для компонента) или `camelCase.js` (для утилиты/хука).
- [ ] Порядок импортов соблюдён (§3.2).
- [ ] Главный компонент экспортирован через `export default function`.
- [ ] JSDoc у главного компонента и у всех хуков/хелперов.
- [ ] Комментарии на русском в сложных местах.
- [ ] Tailwind-классы, inline только где нельзя иначе.
- [ ] Адаптив через Tailwind breakpoints (`md:`, `lg:`, `xl:`).
- [ ] У всех элементов `<motion.*>` внутри `AnimatePresence` есть `key`.
- [ ] Нет магических чисел — всё в именованных константах.
- [ ] В `useEffect` правильные зависимости.
- [ ] Компонент < 250 строк или логически разбит.
- [ ] Нет console.log в production-коде.

---

## 17. Быстрый старт нового компонента — шаблон

Скопируй этот шаблон при создании нового файла секции:

```jsx
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'

import { cn } from '@/utils/cn'

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

/**
 * TODO: описание секции.
 *
 * @param {Object} props
 * @param {string} [props.className]
 */
export default function SectionName({ className }) {
  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={cn('px-4 py-16 md:px-8 md:py-20 lg:px-16 lg:py-24', className)}
    >
      {/* TODO: контент */}
    </motion.section>
  )
}

SectionName.propTypes = {
  className: PropTypes.string,
}
```
