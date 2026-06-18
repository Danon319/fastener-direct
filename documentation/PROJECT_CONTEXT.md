# Fastener Direct — Project Context

## 1. Описание проекта

B2B/B2C интернет-магазин промышленного крепежа (болты, анкеры, метизы, саморезы, химкрепёж). Монорепозиторий с фронтом и бэком, разрабатывается для деплоя на VPS.

Дизайн-референс: Atout Capital (corporate finance, Париж) — структура и визуальный язык. Контент полностью переработан под крепёжную тематику.

---

## 2. Стек (зафиксирован)

| Слой            | Технология                                               |
| --------------- | -------------------------------------------------------- |
| Сборщик         | Vite 8 (Rolldown bundler)                                |
| UI              | React 19 + JavaScript (.jsx)                             |
| Стили           | Tailwind CSS v3.4                                        |
| Анимации        | Motion (npm-пакет `motion`, импорты из `"motion/react"`) |
| Плавный скролл  | Lenis (глобально, хук `useLenis` в `App.jsx`)            |
| Роутинг         | React Router v7                                          |
| Стейт           | Zustand v5                                               |
| Сервер          | Node.js + Fastify 5 (ES modules)                         |
| API             | REST, префикс `/api`                                     |
| ORM             | Drizzle ORM                                              |
| БД              | PostgreSQL 16 (Docker)                                   |
| Файлы (статика) | `client/public`                                          |
| Файлы (контент) | S3-совместимое хранилище                                 |
| Деплой          | VPS                                                      |

Утилиты: `clsx`, `tailwind-merge`, `prop-types`.
Линтинг: ESLint + Prettier + `prettier-plugin-tailwindcss`.

**Запрещено добавлять без подтверждения:** TypeScript; любые UI-библиотеки (MUI, Chakra, shadcn); CSS-in-JS (styled-components, emotion); state-менеджеры кроме Zustand; ORM кроме Drizzle; `framer-motion` (используем `motion`, см. раздел 12).

---

## 3. Структура проекта

```
fastener-direct/
├── client/
│   ├── public/
│   │   ├── fonts/                        # neue-montreal-medium.woff2, neue-montreal-light.woff2
│   │   ├── video/                        # factory_bg.mp4 и др. (для Phase 4 Hero)
│   │   └── logo/                         # knime.svg (брендовый знак)
│   ├── src/
│   │   ├── pages/                        # Route-level страницы: Home, CatalogPage, ProductPage
│   │   ├── components/
│   │   │   ├── ui/                       # Примитивы: Button, IconButton, Logo, NavPill, Checkbox, GridLines, ProductCard, ScrollToTopButton, SupportButton
│   │   │   │   └── icons/                # SVG-иконки (BrandMark, User, YouTube, VK, Plus, Close, Burger, Arrow, Heart, Search, Filter, ChevronDown)
│   │   │   ├── sections/                 # Секции лендинга и site-wide блоки: Hero, HeroHeader, Header, MobileMenu, TopStrip, Footer, OurValues/ServiceProgram/FastenerDiagram/Numbers/Partners/CtaBanner + приватные _MenuItem.jsx, _TaglineLine.jsx
│   │   │   └── catalog/                  # Компоненты каталога: SearchBar, CatalogToolbar, FilterSidebar, FilterAccordion, CategoryDropdown, ActiveFilterChips, Pagination, ProductCardSkeleton, CatalogBackground
│   │   ├── content/                      # Один файл на секцию (header.js, menu.js, footer.js, hero.js, numbers.js, …) + catalog/ (categories, brands, products, helpers, index)
│   │   ├── features/                     # Фичи: auth, cart, checkout, chat (по мере появления)
│   │   ├── config/                       # breakpoints.js — единый источник Tailwind breakpoint-значений для JS
│   │   ├── hooks/                        # useViewport, useCountUp, useScrollDirection, useLenis, useMediaQuery, useBreakpoint, useElementHeight, useCatalogFilters
│   │   ├── store/
│   │   │   ├── slices/                   # По стору на фичу: useUiStore (isMenuOpen), useCartStore (Map id→qty), useFavoritesStore (Set)
│   │   │   └── index.js                  # barrel: реэкспорт всех сторов под @/store
│   │   ├── styles/
│   │   │   └── index.css                 # Tailwind directives + @font-face
│   │   ├── utils/                        # cn.js (clsx + tailwind-merge)
│   │   ├── assets/
│   │   ├── App.jsx                       # useLenis() + TopStrip/Header/<Routes>/Footer/MobileMenu
│   │   └── main.jsx                      # BrowserRouter wrap + lenis.css
│   ├── vite.config.js                    # alias '@/' → './src', proxy /api → :3000
│   ├── tailwind.config.js
│   └── package.json
├── server/
│   ├── src/
│   │   ├── db/
│   │   │   ├── schema/index.js           # Drizzle схемы
│   │   │   └── index.js                  # drizzle() instance (драйвер postgres / postgres.js)
│   │   ├── plugins/cors.js
│   │   ├── routes/index.js               # GET /api/health
│   │   └── app.js
│   ├── drizzle.config.js
│   ├── .env                              # DATABASE_URL, PORT
│   └── package.json                      # type: module
├── docker-compose.yml                    # postgres:16, port 5432
└── .gitignore
```

**Конвенции организации `components/`:**

- `components/ui/` — примитивы переиспользуемые везде (Button, IconButton, Logo, NavPill).
- `components/sections/` — секции лендинга и site-wide блоки (Header, HeroHeader, MobileMenu, TopStrip, Footer). Site-wide компоненты и landing-секции живут здесь вместе по решению Phase 3.
- `components/sections/_ComponentName.jsx` — приватный компонент конкретной секции (используется только внутри одного `.jsx` из `sections/`, не экспортируется из `ui/`). Пример: `_MenuItem.jsx` для MobileMenu.

---

## 4. Нормы кодирования

- Именование файлов компонентов: `PascalCase.jsx` (например, `HeroSection.jsx`).
- Стили: Tailwind v3 как основа; inline-стили допустимы только для динамических значений, которые нельзя выразить через Tailwind.
- **Адаптив:** только стандартные Tailwind breakpoints — `sm` `md` `lg` `xl` `2xl` (mobile-first). **Запрещены JS-таблицы вида `R[bp]={...}`** или подобные runtime-карты breakpoint → значение. Если адаптация требует разного количества DOM-элементов (например, curtain-колонки 4/6/8/10) или branching по ширине окна в JSX, используется глобальный хук `useBreakpoint(name, ssrDefault?)` из `@/hooks` (тонкий wrapper над `useMediaQuery` + именованные значения из `@/config/breakpoints`). Сырые литералы `'(min-width: 1024px)'` и локальные `window.matchMedia`-хелперы запрещены — допустимы только нестандартные пороги вроде 1440px через `useMediaQuery('(min-width: 1440px)', ssrDefault)`.
- **API:** только задокументированные API Tailwind v3, Motion (`motion/react`), React Router v7, Fastify 4, Drizzle. Если не уверен — не использовать.
- Комментарии в коде: на русском, минимум, только где логика неочевидна.
- Чат: русский. Код и комментарии: английский.

Эталонный `CODE_STYLE.md` создан и поддерживается отдельно — он базируется на готовых прототипах (hero-section, footer-section, numbers-section, cta-banner) и должен быть прочитан Claude Code при старте сессии (см. `CLAUDE.md`).

---

## 5. Дизайн-токены (`tailwind.config.js`)

**Шрифты:**

- Основной: Neue Montreal (Medium + Light, через `@font-face` в `styles/index.css`, файлы в `public/fonts/`).
- Fallback: Plus Jakarta Sans, system-ui, sans-serif.

**Цвета (`theme.extend.colors`):**

| Token        | Hex       | Назначение                                     |
| ------------ | --------- | ---------------------------------------------- |
| `red`        | `#d03328` | Красный акцент (CTA)                           |
| `redHover`   | `#7c1e18` | Hover/active красных кнопок                    |
| `navy`       | `#1c2024` | Основной тёмный (текст / тёмные секции)        |
| `slate`      | `#2e3f51` | Slate (фон карточек партнёров и т.п.)          |
| `slateHover` | `#768597` | Hover slate / приглушённые ссылки              |
| `light`      | `#ECEEF0` | Светлый фон секций                             |
| `footerBg`   | `#161a1d` | Фон футера                                     |
| `muted`      | `#6b7a8a` | Muted текст                                    |
| `card`       | `#f3f5f7` | Фон карточек                                   |
| `tagDate`    | `#e4e8ec` | Фон тега даты (карточки партнёров)             |
| `gridLine`   | `#d1d1d1` | Цвет вертикальных колоночных линий (GridLines) |

**Z-стек (`theme.extend.zIndex` в `tailwind.config.js`):** `hero` (1), `wrapper` (10), `header` (100), `topstrip` (200), `filterBackdrop` (500), `filterPanel` (501), `menu` (1000). См. комментарий в `tailwind.config.js` — это единственный источник правды.

---

## 6. Страницы и роуты

| Путь                  | Страница                          | Доступ      |
| --------------------- | --------------------------------- | ----------- |
| `/`                   | Главная (лендинг)                 | Все         |
| `/catalog`            | Каталог                           | Все         |
| `/catalog/:productId` | Карточка товара                   | Все         |
| `/cart`               | Корзина                           | Покупатель+ |
| `/checkout`           | Оформление заказа                 | Покупатель+ |
| `/orders`             | Список всех заказов               | Покупатель+ |
| `/orders/:orderId`    | Информация о заказе               | Покупатель+ |
| `/account`            | Кабинет (просмотр/редактирование) | Покупатель+ |
| `/auth`               | Регистрация / вход                | Гость       |
| `/about`              | О нас                             | Все         |
| `/manufacturers`      | О производителях                  | Все         |
| `/become-partner`     | Стать партнёром (форма заявки)    | Все         |
| `/contacts`           | Контакты                          | Все         |
| `/support`            | Помощь (чат)                      | Все         |
| `/contact-chat`       | Связь (чат)                       | Все         |
| `/admin`              | Админ-панель                      | Админ       |

---

## 7. Роли пользователей

| Роль          | Получение                                  | Доступ                                          |
| ------------- | ------------------------------------------ | ----------------------------------------------- |
| Гость         | По умолчанию                               | Просмотр каталога, отправка заявок              |
| Покупатель    | Обычная регистрация                        | + корзина, оформление, кабинет, история заказов |
| Производитель | Подача заявки на `/become-partner` + отбор | + кабинет партнёра                              |
| Админ         | Только выдача прав от Главного Админа      | Полный доступ + админ-панель                    |

---

## 8. Планируемые сущности БД (Drizzle schemas)

| Таблица                | Назначение                            |
| ---------------------- | ------------------------------------- |
| `users`                | Пользователи (с полем `role`)         |
| `products`             | Товары                                |
| `categories`           | Категории товаров                     |
| `product_images`       | Ссылки S3 на фото товаров             |
| `orders`               | Заказы                                |
| `order_items`          | Позиции в заказе                      |
| `cart_items`           | Корзина (привязка к user)             |
| `addresses`            | Адреса доставки                       |
| `reviews`              | Отзывы о товарах                      |
| `partners`             | Партнёры-заводы                       |
| `partner_applications` | Заявки на партнёрство                 |
| `chat_messages`        | Сообщения в чатах поддержки/связи     |
| `articles`             | Контентные статьи (админ-загружаемые) |

Точные поля и связи прорабатываются по мере реализации фич.

---

## 9. Хранение файлов

| Тип                                                          | Хранилище        |
| ------------------------------------------------------------ | ---------------- |
| Иконки, логотип, декоративные картинки/видео сайта           | `client/public/` |
| Фото товаров, фото производителей (пользовательский контент) | S3               |
| Статьи, каталог товаров (админ-контент)                      | S3               |

---

## 10. Текущее состояние

> Хронологический журнал всех фаз и хотфиксов вынесен в [PHASE_HISTORY.md](./PHASE_HISTORY.md).
> Ниже — снимок реального состояния кода (сверено с репозиторием и git, май 2026).

### Готово

**Frontend — лендинг (`/`) собран полностью:**

- `Home.jsx` рендерит реальный `<Hero />` (видео-фон `factory_bg.mp4`, анимированный tagline) + `<HeroHeader />` (отдельный компонент, scroll-away вверх) + 6 секций в обёртке: `OurValuesSection` → `ServiceProgramSection` → `FastenerDiagramSection` → `NumbersSection` → `PartnersSection` → `CtaBannerSection`.
- У всех секций — entrance-анимации (mount-based в Hero/HeroHeader, `whileInView` в секциях) с reduced-motion guard.
- Site-wide: `TopStrip` (slide-in), `Header` (двухтемовый, opacity-fade, reverse scroll-direction, всегда виден вне Home), `MobileMenu` (curtain-overlay), `Footer`.

**Frontend — каталог:**

- `/catalog`, `/catalog/:category`, `/catalog/:category/:subcategory` → `CatalogPage.jsx`.
- Вся бизнес-логика (фильтры / сортировка / пагинация / URL) — в хуке `useCatalogFilters`.
- Компоненты `components/catalog/`: `SearchBar`, `CatalogToolbar`, `FilterSidebar`, `FilterAccordion`, `CategoryDropdown`, `ActiveFilterChips`, `Pagination`, `ProductCardSkeleton`, `CatalogBackground`.
- `ProductCard` (примитив), `/product/:id` → `ProductPage.jsx` (placeholder).
- Контент каталога — в `content/catalog/` (`categories`, `brands`, `products`, `helpers`, `index`).

**Frontend — инфраструктура:**

- Глобальный плавный скролл — **Lenis** (`useLenis` в `App.jsx`). Прежний `useMomentumLift` удалён.
- Примитивы `components/ui/`: `Button`, `IconButton`, `Logo`, `NavPill`, `Checkbox`, `GridLines`, `ProductCard`, `ScrollToTopButton`, `SupportButton` + `icons/`.
- Хуки: `useViewport`, `useCountUp`, `useScrollDirection`, `useLenis`, `useElementHeight`, `useMediaQuery`, `useBreakpoint`, `useCatalogFilters`.
- Zustand-слайсы: `uiSlice` (`isMenuOpen`), `cartSlice` (Map `productId → qty`), `favoritesSlice` (Set).
- Адаптивный слой централизован через `config/breakpoints.js` + `useBreakpoint`.
- FAB: `SupportButton` на Home, `ScrollToTopButton` на каталоге.

**Backend (Phase 0, без изменений):**

- Fastify-сервер на `:3000`, единственный роут `GET /api/health → { status: "ok" }`.
- Drizzle подключён к PostgreSQL (драйвер `postgres` / postgres.js) через `DATABASE_URL`; `docker-compose.yml` поднимает PostgreSQL 16.

### Реализованные роуты (из таблицы §6)

`/` · `/catalog` · `/catalog/:category` · `/catalog/:category/:subcategory` · `/product/:id` · catch-all (`*` → `null`).

Остальные роуты из §6 (`/cart`, `/checkout`, `/orders`, `/account`, `/auth`, `/about`, `/manufacturers`, `/become-partner`, `/contacts`, `/support`, `/contact-chat`, `/admin`) — **спецификация, не реализованы**.

### Следующее

- **Frontend:** `Reviews`-секция лендинга; остальные страницы и роуты из §6.
- **Backend:** Drizzle-схемы (таблицы §8 — `server/src/db/schema/index.js` пока пуст); auth (регистрация / вход); Docker-образы для `client` и `server`; S3-интеграция для пользовательского / админ-контента.

## 11. Правила работы Claude в этом проекте

1. Если что-то непонятно или не уверен — не додумывать. Сначала список уточняющих вопросов, потом план, потом подтверждение, и только потом код.
2. Обязательная схема: **Вопросы → План → Подтверждение → Реализация.**
3. Только задокументированные API: Tailwind v3, Motion (`motion/react`), React Router v7, Fastify 5, Drizzle. Не выдумывать классы / props / методы.
4. Не добавлять зависимости без подтверждения.
5. Не лезть в файлы за пределами scope задачи.
6. Код без заглушек и placeholder'ов. Всё должно быть рабочим и копируемым.
7. Не рефакторить молча — флагнуть и спросить, если встречен нестандартный паттерн.

---

## 12. Заметка про пакет анимаций

В проекте используется npm-пакет **`motion`** (версия `^12`), это официальный преемник Framer Motion после ребрендинга 2024 года.

- Импорты идут из `"motion/react"`, **не** из `"framer-motion"`.
- API совместим с Framer Motion v11 (те же `motion`, `AnimatePresence`, `useScroll`, `useTransform`, `useMotionValue`, `useInView` и т.д.).
- Пакет `framer-motion` в проекте **не установлен и не должен устанавливаться**.
- Если в стороннем туториале или в Stack Overflow ответе встречается `import { motion } from "framer-motion"` — переписать на `"motion/react"`.

Whitelist API из `motion/react`, используемых в проекте: `motion`, `animate`, `initial`, `exit`, `variants`, `whileHover`, `whileTap`, `AnimatePresence`, `useScroll`, `useTransform`, `useSpring`, `useVelocity`, `useReducedMotion`, `useMotionValue`, `useMotionValueEvent`, `useInView`. Других API без согласования не использовать.
