# Fastener Direct — История фаз и хотфиксов

Хронологический журнал реализации проекта: что делалось по фазам и в хотфиксах.
Стабильный справочник и снимок текущего состояния — в [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md).

Раздел «Что уже сделано» (фазы Phase 0 → Wave 8) и все Hotfix-логи перенесены сюда из
`PROJECT_CONTEXT.md` **дословно**. Раздел «Wave 9» дописан по git-истории, чтобы журнал
не отставал от реального состояния кода.

---

## 10. Что уже сделано

**Инфраструктура (Phase 0):**

- Скаффолдинг монорепозитория.
- Vite 8 + React 19 + Tailwind v3 подключены.
- React Router v7 + Zustand v5 установлены и настроены (`BrowserRouter` в `main.jsx`).
- Fastify сервер запускается на `:3000`, health-check `GET /api/health → { status: "ok" }`.
- Drizzle подключён к PostgreSQL через `DATABASE_URL`.
- `docker-compose.yml` поднимает PostgreSQL с persistent volume.
- Tailwind config с цветами и шрифтами проекта.
- Подключение шрифтов Neue Montreal Medium/Light через `@font-face` в `styles/index.css` (файлы в `public/fonts/`).
- Эталонный `CODE_STYLE.md`.

**Frontend компоненты (Phase 1 + 1.5):**

- 8 SVG-иконок: BrandMark, User, YouTube, VK, Plus, Close, Burger, Arrow.
- `Button` (3 размера sm/md/lg + swap-анимация двух стрелок).
- `IconButton` (3 variants: light/dark/filled, props `pressed`/`interactive`/`visible`).
- `Logo` (variants `full`/`mark`, theme `dark`/`light`).

**Frontend хуки (Phase 2):**

- `useViewport` (`canHover`, `isTouch`).
- `useCountUp`.
- `useScrollDirection`.

**Frontend инфраструктура и Footer (Phase 3A + 3C):**

- `react-router-dom@^7` + `zustand@^5` интегрированы.
- `Button` и `Logo` поддерживают optional prop `to` (если задан → `<Link>`, иначе → родной элемент).
- Zustand slice `useUiStore` (`isMenuOpen`, `setMenuOpen`).
- `Footer.jsx` с реальным контентом из прототипа (`content/footer.js`).
- `Home.jsx` — главная страница (dummy Hero placeholder + playground для demo-примитивов).
- `App.jsx`: `<TopStrip />` + `<Header />` + `<Routes>` + `<Footer />` + `<MobileMenu />`. `BrowserRouter` живёт в `main.jsx`, не в `App.jsx`.

**Header, навигация и MobileMenu (Phase 3B):**

- `NavPill` (примитив для пилюль-ссылок в шапке; варианты `heroWhite`, `heroLang`, `red` и др., поддерживает `to` → `<Link>`).
- `TopStrip.jsx` — узкая верхняя полоса над шапкой (служебные ссылки/контакты).
- `Header.jsx` — sticky-шапка над страницей: двухтемовая (прозрачная над Hero / светлая на скролле, триггерится через `useScrollDirection`), Logo + NavPills на десктопе, Burger на мобиле, кнопка `Plus` открывает `MobileMenu` через `useUiStore.setMenuOpen(true)`.
- `HeroHeader.jsx` — absolute-хедер поверх Hero-секции (transparent + белый текст). Сейчас живёт внутри dummy-Hero в `Home.jsx`, в Phase 4 переедет внутрь реального компонента Hero. На мобиле имеет локальный dropdown под Burger; кнопка `Plus` всё так же открывает `MobileMenu`.
- `MobileMenu.jsx` — полноэкранный overlay с curtain-анимацией (красные колонки падают сверху, staggered), fade-in контента, Esc-закрытие, scroll-lock, focus-trap.
- `_MenuItem.jsx` — приватный компонент для пунктов меню внутри `MobileMenu`.
- `content/header.js` (`LANG_LABELS`, `NAV_LINKS`, `ACCOUNT_LINK`), `content/menu.js` (`MENU_PRIMARY`, `MENU_SECONDARY`).
- Визуальные баги после ревью 3B исправлены (commit `e5e5837`).

**Hotfix #1 (post-3B):**

- IconButton variant `slate` (MenuBtn/CloseBtn).
- `overflow-x: clip` on html/body.
- Logo `size` prop + responsive (mark on mobile, full sm+ on desktop).
- NavPill -20%.
- Catch-all route `<Route path="*" element={null}/>`.

**Hotfix #2 (post-3B):**

- Scrollbar hidden visually.
- NavPill +5% (net -15% from original).
- IconButton height aligned with NavPill.
- MobileMenu padding: 24px mobile / 48px desktop / 50px vertical.
- MenuItem gap 5px + leading-none.
- Curtain/grid-lines: 5 columns (<768px) / 11 (>=768px).

**Hero visual + tagline (Phase 4A):**

- `Hero.jsx` with video background (`/video/factory_bg.mp4` + poster), overlay `bg-black/30`.
- Big text "Faste / Direct" (19.76vw, font-medium, opacity 50%).
- `_TaglineLine.jsx` — private component with 6-phase motion machine: mount -> firstEnter -> rest -> exiting -> preEnter -> entering. Blur+drift crossfade every ~5s.
- 4 tagline pairs in `content/hero.js`. Stagger 150ms between white and red lines.
- Pause/resume tagline and video on `document.visibilitychange`.
- Layout switch at 1024px: desktop (2 rows) / stacked (3 rows).

**NumbersSection (Phase 5.1):**

- `NumbersSection.jsx` создан — count-up статистика с staggered entrance-анимацией (fade+rise + вертикальная линия).
- `content/numbers.js` создан — данные и константы тайминга.
- Размещён в `Home.jsx` внутри momentum-lift wrapper.

**PartnersSection (Phase 5.2):**

- `PartnersSection.jsx` создан — адаптивная сетка карточек партнёров с container-query fluid-типографикой (cqw), hover-эффекты через Tailwind group-hover.
- `content/partners.js` создан (placeholder-данные 6 партнёров).
- Размещён в `Home.jsx` внутри momentum-lift wrapper после NumbersSection.
- `@tailwindcss/container-queries` установлен и зарегистрирован в tailwind.config.js.
- Добавлены токены `card`, `tagDate`, `photoPlaceholder` в tailwind.config.js.

**CtaBannerSection (Phase 5.3):**

- `CtaBannerSection.jsx` создан — CTA-баннер с фоновым фото (`/banner/banner.jpg`), полупрозрачным overlay (black/55), заголовком и Button.
- `content/ctaBanner.js` создан — title, buttonText, image path.
- Размещён в `Home.jsx` внутри momentum-lift wrapper после PartnersSection.
- Полностью статичная секция, без motion-анимаций.

**ServiceProgramSection (Phase 5.4):**

- `ServiceProgramSection.jsx` создан — секция «Сервисная программа» с 3 режимами отображения: desktop (hover-rows с красным фоном, slide description, IconButton dark), tablet (stacked rows, IconButton light), mobile/tile (карточки с press-feedback, IconButton filled+pressed).
- `content/serviceProgram.js` создан — 4 сервиса (подбор по чертежу, комплектация, документооборот, хранение).
- Размещён в `Home.jsx` внутри momentum-lift wrapper перед NumbersSection.
- Entrance-анимация: fade+rise через useInView, divider scaleX(0→1).
- Добавлен Tailwind-токен `divider` (#d9dde1).

**FastenerDiagramSection (Phase 5.6):**

- `FastenerDiagramSection.jsx` создан — donut-диаграмма клиентов с анимированными сегментами (двухфазный skate+grow), декоративными кольцами, flag-лейблами на desktop/tablet, легендой на mobile.
- `content/fastenerDiagram.js` создан — 6 секторов, SVG-геометрия, анимационные константы.
- Размещён в `Home.jsx` внутри momentum-lift wrapper после ServiceProgramSection, перед NumbersSection.
- Breakpoint-разрешение для SVG-зависимой геометрии (maxWidth, alignment): композиция `useMediaQuery('(min-width: 1440px)')` + `useBreakpoint('lg')` + `useBreakpoint('md')` → 4-уровневый `bp` (`'xl' | 'lg' | 'md' | 'sm'`). 1440px остаётся inline как нестандартный порог; lg/md идут через общий `@/hooks` (см. Hotfix A).
- useMotionValue + useMotionValueEvent + animate для frame-accurate sync анимации.

**OurValuesSection (Phase 5.7):**

- `OurValuesSection.jsx` создан — секция «Наши ценности» с 5 карточками (Надёжность, Гибкость, Качество, Партнёрство, Оперативность).
- `content/ourValues.js` создан — тексты, карточки, анимационные константы.
- Desktop: 15-column grid overlay, scroll-driven diagonal card animation (useScroll + useTransform + useSpring).
- Mobile: stacked cards с fade-in через whileInView.
- Размещён в `Home.jsx` как ПЕРВАЯ секция в momentum-lift wrapper (перед ServiceProgramSection).
- Локальные хуки `useIsDesktop` и `useViewportWidth` — не вынесены в shared hooks.
- Кнопка «О компании» — компонент `Button` (default variant, white pill + red arrow circle).

**Assembly (Phase 6.1):**

- `Home.jsx` cleaned up: removed Phase 2 demo playground (`<main>` block with icons, buttons, logos, hooks demos).
- Removed unused imports: `useState`, `useViewport`, `useCountUp`, `useScrollDirection`, `Button`, `IconButton`, `Logo`, `BrandMark`, `User`, `YouTube`, `VK`, `Plus`, `Close`, `Burger`, `Arrow`.
- 6 sections in final order inside momentum-lift wrapper: OurValuesSection, ServiceProgramSection, FastenerDiagramSection, NumbersSection, PartnersSection, CtaBannerSection.
- Hero-spacer and footer-spacer preserved.

**Momentum lift, fixed Hero & Footer (Phase 4B):**

- `useMomentumLift` hook (`src/hooks/useMomentumLift.js`): useScroll + useVelocity + useSpring + useTransform. Amplitude +/-100px, velocity cap 2500, spring stiffness 83 / damping 20 / mass 1 (overdamped, no bounce). prefers-reduced-motion -> amplitude 0.
- `useElementHeight` hook (`src/hooks/useElementHeight.js`): ResizeObserver-based height measurement via CSS selector.
- `Hero.jsx`: root `<section>` became `fixed top-0 h-screen z-[1]`.
- `Footer.jsx`: became `fixed bottom-0 z-[1]`.
- `Home.jsx`: hero-spacer (h-screen) after Hero, `motion.section` wrapper with `y: lift` wraps all demo sections (z-10, rounded-2xl, symmetric shadow), footer-spacer sized via ResizeObserver after wrapper.
- Z-stack: Hero z-[1], Footer z-[1], Wrapper z-10, Header z-100, TopStrip z-200, MobileMenu z-1000.

**Catalog page skeleton (Phase 7A):**

- Zustand slices: `cartSlice.js` (useCartStore — toggle/has/count) and `favoritesSlice.js` (useFavoritesStore — same API). Both use `Set` for O(1) lookups.
- `content/catalog.js` created: PRODUCTS (8 items with id/name/category/material/brand/price/inStock/image), CATEGORY_TREE (2 groups: Крепёж → химический, Метизы → болты/винты/гайки), MATERIALS, BRANDS, BREADCRUMB_LABELS.
- `CatalogPage.jsx` created: skeleton grid (2 cols mobile, 4 cols lg), reads `:category` URL param to filter products by categoryKey from CATEGORY_TREE, breadcrumbs placeholder, toolbar placeholder, footer-spacer via useElementHeight.
- Routes added in `App.jsx`: `/catalog` and `/catalog/:category` → CatalogPage.
- `Header.jsx` made route-aware: uses `useLocation` — on non-Home pages (`pathname !== "/"`), Header is always visible (translateY threshold logic skipped). Home behavior unchanged.

**ProductCard + Grid (Phase 7B):**

- `Heart.jsx` icon created (outline/filled variants via `filled` prop), exported from `icons/index.js`.
- `ProductCard.jsx` created in `components/ui/`: product photo with object-contain, line-clamp-3 name, availability dot indicator (green/muted), split price display (integer large + kopecks small), favorites heart button with spring scale animation.
- Cart button 3-state behavior: "В корзину" (red bg) → "Добавлено" (green, auto 1.5s, checkmark) → "В корзине" (outline border). AnimatePresence slide transitions. Out-of-stock: disabled muted button "Нет в наличии".
- CatalogPage grid: 2 cols base / 3 cols md / 4 cols lg. Empty state "Ничего не найдено" when filter yields 0 results.
- Cart and favorites state managed by existing Zustand slices (cartSlice, favoritesSlice).

**Search + Filters + Breadcrumbs (Phase 7C):**

- New icons: `Search.jsx`, `Filter.jsx`, `ChevronDown.jsx` in `components/ui/icons/`.
- New directory `components/catalog/` with 6 components:
  - `Breadcrumbs.jsx` — derives full path from URL slug + CATEGORY_TREE (Главная / Каталог / [Parent] / [Current]).
  - `SearchBar.jsx` — controlled input with search icon, instant filtering by product name.
  - `CatalogToolbar.jsx` — horizontal bar: filter button (with active-count badge), search input, disabled sort button ("Скоро" tooltip).
  - `FilterPanel.jsx` — desktop dropdown below toolbar (AnimatePresence height animation), 3-column accordion layout, apply/reset buttons.
  - `FilterSheet.jsx` — mobile fullscreen bottom sheet (slide-up, backdrop, scroll-lock, Esc-close), stacked accordions, apply/reset footer.
  - `FilterAccordion.jsx` — collapsible group with chevron rotation, custom red checkboxes, tree mode for CATEGORY_TREE (parent toggles all children, indeterminate state).
- CatalogPage orchestrates all filter state: searchQuery, selectedCategories/Materials/Brands (staged + applied), isFilterOpen. Filters are AND between groups, OR within groups. "Применить" commits staged → applied. "Сбросить" clears staged. URL :category acts as pre-filter (parent slugs expand to all children keys). Desktop uses FilterPanel, mobile uses FilterSheet (via useViewport canHover).

**Hotfix 7.1 (Data Restructure + Bug Fixes + Card Rework):**

- CATEGORY_TREE restructured: 3 top-level categories (Строительный крепёж, Химический крепёж, Грузовой крепёж) with subcategories. Each has `slug`, `image`, `children[]`.
- Products updated: each product has `parentCategory` (top-level slug), `subcategory` (categoryKey), `brandLogo` (SVG path). `MATERIALS` export removed.
- `cartSlice.js` reworked: Map-based (productId → quantity). API: `addToCart(id, qty)`, `removeFromCart(id)`, `updateQuantity(id, qty)`, `isInCart(id)`, `getQuantity(id)`, `getCartCount()`.
- `ProductCard.jsx` reworked: wrapped in `<Link to="/product/:id">`, brand logo top-left, favorites heart top-right, quantity selector (−/qty/+) left of cart button, cart button with `min-w-28` (no layout shift), max-w-[250px] max-h-[450px], photo area ≤40%. Out-of-stock: text only, no cart/qty UI. Interactive elements use `e.preventDefault()+e.stopPropagation()`.
- `SearchBar.jsx`: max-w-[500px] added.
- `CatalogToolbar.jsx`: sort button removed, "Каталог" dropdown placeholder added (inactive, Hotfix 7.2).
- Scroll-to-top fix: `useEffect(() => window.scrollTo(0, 0))` on CatalogPage (on mount + route param change) and Home.jsx (on mount).
- Product grid: CSS Grid `auto-fill` with `minmax(160px, 250px)`, cards don't exceed 250px, centered.
- Routes: `/catalog`, `/catalog/:category`, `/catalog/:category/:subcategory`, `/product/:id`.
- `ProductPage.jsx` created: placeholder with product ID and back-to-catalog link.
- `Breadcrumbs.jsx` updated: supports 2-level params (category + subcategory).
- `FilterPanel.jsx` and `FilterSheet.jsx` updated: material filter removed (only category + brand remain).

**Hotfix 7.3 (Catalog Data Restructure + Cleanup):**

- `content/catalog.js` split into `content/catalog/` directory: `categories.js` (CATEGORY_TREE, BREADCRUMB_LABELS), `brands.js` (BRANDS), `products.js` (PRODUCTS + JSDoc shape comment), `index.js` (re-exports all). Old `catalog.js` deleted. Import path `@/content/catalog` resolves to `catalog/index.js` via Vite/Node module resolution.
- `SearchBar.jsx` fixed: `<input>` now has `id="catalog-search"`, `name="search"`, `autoComplete="off"`. Visually hidden `<label htmlFor="catalog-search">` added for accessibility. Console warning eliminated.
- `ProductCard.jsx` cleanup: removed dead `category: PropTypes.string.isRequired` propType (field exists in data but is never read by the component).

**Hotfix 7.4 (Product Card Redesign):**

- `ProductCard.jsx` reworked layout: photo (fixed `h-44`, ≤40% of max-h-[450px]) → large price (`text-3xl`) → product name (line-clamp-2, text-navy) → bottom row (qty selector + cart button) or centered red "Нет в наличии" for OOS.
- Removed in-stock "В наличии" indicator (green dot + text) entirely. OOS indicator moved from its dedicated row into the bottom row, styled in `text-red`.
- Photo container changed from percentage `max-h-[40%]` (which resolved to none because parent had only `max-h`, not a definite height) to fixed `h-44` (176px) — guarantees the photo area constraint and prevents image overflow into the title region.
- Hover effect: card lifts (`hover:-translate-y-1`) and shadow grows (`shadow-sm` → `hover:shadow-lg`) with `transition duration-200`. Applied conditionally via `canHover` from `useViewport` so it does not trigger on touch devices.
- `useViewport` hook imported into `ProductCard.jsx` to gate hover classes.
- Cart button still uses `min-w-28` (no width jerk during 3-state transitions). QuantitySelector behavior unchanged. Whole card still wrapped in `<Link to="/product/:id">`, interactive elements still call `e.preventDefault() + e.stopPropagation()`.

**Hotfix 7.5 (Catalog Page Redesign):**

- Каталог переработан в лэндинг-архитектуру (как `Home.jsx`): фиксированный декоративный фон + плавающий тулбар (роль «Hero») + тёмная каталог-секция (роль «wrapper» с momentum lift).
- `CatalogBackground.jsx` создан в `components/catalog/`: `position: fixed`, z-0, фон `bg-tagDate` (#E4E8EC), вертикальные колоночные линии (15 на десктопе, 6 на мобильном) — паттерн как в `OurValuesSection`. Локальный хук `useIsDesktop` (matchMedia 1024px), не выносится в shared hooks.
- `CatalogToolbar.jsx` переделан: корневой `motion.div` стал `position: fixed`, z-50. Через `useScroll + useTransform` интерполирует `top` (от `vh/2` до `100px` — высота Header + зазор) и `y` (от `-50%` до `0%`) на диапазоне `[0, window.innerHeight]`. Принимает `children` — слот для `CategoryDropdown`, который теперь рендерится внутри тулбара (absolute), чтобы следовать за его положением. Локальный resize-listener поддерживает `vh` актуальным.
- `CatalogPage.jsx` переписан под новый layout: `<CatalogBackground />` → `<CatalogToolbar>` с дроп-дауном внутри → спейсер `h-[90vh]` (создаёт ~10% peek каталог-секции из-под низа вьюпорта при `scrollY=0`) → `motion.section bg-navy rounded-t-2xl` с `style={{ y: lift }}` (`useMomentumLift`, те же параметры, что в `Home.jsx`) → внутри: `Breadcrumbs`, `ActiveFilterChips`, сетка → footer-spacer через `useElementHeight('footer')`.
- `ActiveFilterChips.jsx` создан: ряд «пилюль» над сеткой товаров. Чипы для URL category (× → `/catalog`), URL subcategory (× → `/catalog/:category`), поиск (× → очистка), каждого применённого бренда (× → удалить из applied), диапазона цен (× → сброс), флага «В наличии» (× → unset). Чипы — `bg-light text-navy`, × — Close-иконка. Если ни один фильтр не активен — рендерит `null`.
- `ProductCardSkeleton.jsx` создан: плейсхолдер карточки с теми же размерами, что `ProductCard` (`max-w-[250px]`, `max-h-[450px]`, `h-44` фото). Блоки-заглушки — `animate-pulse bg-tagDate`. На странице: 8 скелетонов при `isInitialLoading=true` (первые 300 мс), затем — реальные карточки.
- Stagger fade-in карточек: `<AnimatePresence mode="popLayout">` оборачивает сетку, каждый `<ProductCard>` — в `motion.div` с `initial={{ opacity: 0, y: 12 }}`, `animate={{ opacity: 1, y: 0 }}`, `exit={{ opacity: 0 }}`, `transition={{ duration: 0.3, delay: i * 0.05 }}`. Ключ — `product.id`. Срабатывает на каждое изменение `filtered` (фильтры/сортировка/поиск/URL).
- `Breadcrumbs.jsx` рестайлинг под тёмный фон: ссылки `text-slateHover` → hover `text-light`, текущий элемент `text-light`, разделитель `text-slateHover`. Логика навигации не тронута.
- Пустое состояние «Ничего не найдено» перекрашено в `text-slateHover` (читается на `bg-navy`).
- Z-стек: `CatalogBackground` z-0 (фон) → каталог-секция z-10 → `CatalogToolbar` z-50 (с дропдауном z-40 внутри) → Header z-100 → TopStrip z-200 → FilterSidebar z-500/501 → MobileMenu z-1000. Конфликтов нет.

**Hotfix 7.6 (Catalog Visual Fixes):**

- `Breadcrumbs` удалены из `CatalogPage.jsx` (рендер и импорт). Файл `Breadcrumbs.jsx` оставлен в `components/catalog/` для возможного переиспользования.
- `ProductCard.jsx`: `max-h-[450px]` → `h-[450px]` — единая высота для in-stock и OOS-карточек. Фото `h-44` (176px) сохраняет ≤40% от высоты карточки (176/450 = 39.1%, ограничение из Hotfix 7.4).
- `CatalogToolbar.jsx`: убраны `useScroll + useTransform` и `motion.div`. Контейнер — обычный `div` с `position: fixed`, `top-1/2 -translate-y-1/2`, `z-[1]` (роль Hero — переключение через `visibility`). Локальный `useEffect`-listener скролла: `visible = window.scrollY < window.innerHeight`. Дроп-даун (`CategoryDropdown`) по-прежнему рендерится внутри тулбара и наследует его visibility.
- `ScrollToTopButton.jsx` создан в `components/ui/`: плавающая FAB в правом нижнем углу (`fixed bottom-5 right-5 z-50`). Появляется при `window.scrollY > 300` через `AnimatePresence` + opacity-fade (`duration: 0.2`). Использует `IconButton` (variant `filled` — красный круг) с дочерней иконкой `Arrow`. Поворот стрелки вверх задан через arbitrary-вариант `[&_svg]:-rotate-90` на самой кнопке (IconButton перезаписывает className на дочерней иконке через `cloneElement`). Клик — `window.scrollTo({ top: 0, behavior: 'smooth' })`. Смонтирован один раз в `CatalogPage`.
- `ActiveFilterChips.jsx`: пилюли ~2× больше (`px-3 py-1` → `px-6 py-2.5`, `text-sm` → `text-base`, Close size 14 → 18). Цветовое кодирование по типу — `CHIP_STYLES`: категория/подкатегория URL — `bg-red text-light`; поиск — `bg-white text-navy`; фильтры (бренд/цена/в наличии) — `bg-slateHover text-light`. Цвет × наследуется через `currentColor` (`Close` иконка).
- Footer-спейсер (`<div style={{ height: footerH }} />`) перенесён внутрь `motion.section bg-navy`, чтобы тёмный фон каталога продолжался до самого Footer и фон страницы (`CatalogBackground` — серый с вертикальными линиями) не просвечивал в нижней щели.

**Hotfix 7.7 (Visual Fixes + Bugs):**

- `CatalogToolbar.jsx`: кнопка «Фильтры» получила фон `bg-slateHover` (#768597), текст/иконка — `text-light`, hover — `brightness-90` (через className-override на `NavPill variant="default"`). Остальные две кнопки тулбара (SearchBar, «Каталог» red-pill) — без изменений.
- `ProductCard.jsx`: добавлен `w-full` к `<Link>` — карточка теперь занимает всю ширину grid-ячейки (до `max-w-[250px]`). Без `w-full` карточка ужималась по содержимому в `repeat(auto-fill, minmax(160px, 250px))`-сетке. Высота `h-[450px]`, фото `h-44`, нижняя строка с `mt-auto` (одинаковая высота для in-stock и OOS) — без изменений.
- `ScrollToTopButton.jsx`: `IconButton` теперь рендерится с `size={60}` (1.5× базовых 40, иконка масштабируется внутри `IconButton` пропорционально через `size * 0.36`). Позиция — `bottom-[30px] right-[30px]`.
- `CatalogPage.jsx`: bottom-gap уменьшен — `pb-16` → `pb-8` на внутреннем контейнере, footer-спейсер `height: footerH` → `footerH / 2`. Видимое пустое тёмное пространство между последним рядом карточек и Footer сократилось примерно вдвое.
- Pagination `components/catalog/Pagination.jsx` создан: текстовая минималистичная пагинация без рамок (стиль «‹ 1 ... 4 5 6 ... 265 ›»), стрелки — повёрнутые `ChevronDown` (`rotate-90` / `-rotate-90`), активная страница — `text-red` + underline, неактивные — `text-light` → `text-red` на hover, разделитель «...» — `text-slateHover`, disabled-стрелки — `text-slateHover/40` без hover. Алгоритм видимых страниц: всегда показываем `1, current-1, current, current+1, totalPages` (с dedup/sort), между несмежными вставляем «...».
- `CatalogPage.jsx` пагинация-интеграция: добавлены константа `ITEMS_PER_PAGE = 16`, state `currentPage`, `useEffect` сбрасывает страницу на 1 при смене `category/subcategory/appliedFilters/searchQuery/activeSort`. `productsToRender = filtered.slice(...)` рендерится в сетке вместо `filtered`. Сама `<Pagination>` рендерится только при `totalPages > 1`, с `className="mb-[50px]"` (50px над footer-спейсером).
- Spring overshoot fix (`CatalogPage.jsx`): `motion.section` получил `paddingBottom: SPRING_OVERSHOOT_PAD_PX (=100)` (равно `AMPLITUDE_PX` из `useMomentumLift`). Раньше при отрицательном overshoot пружины секция уезжала вверх на до 100px и под её низом проглядывал `CatalogBackground` (серый с вертикальными линиями). Теперь bg-navy секции продолжается на 100px ниже спейсера — overshoot не оголяет фон.
- Bug investigation (новые товары/категории не появляются в каталоге): корневая причина — фильтрация по URL-параметрам требует, чтобы `product.parentCategory` точно совпадал с `CATEGORY_TREE[].slug`, а `product.subcategory` — с `CATEGORY_TREE[].children[].categoryKey`. Если новый товар добавлен со slug'ами, которых нет в `CATEGORY_TREE`, он не покажется ни под одним фильтрованным маршрутом `/catalog/:category` или `/catalog/:category/:subcategory`, но останется виден на корневом `/catalog` (где URL-фильтра нет). Аналогично новая категория должна быть добавлена в `CATEGORY_TREE` с корректным `slug`, `categoryKey`, `image` — иначе `CategoryDropdown` её не покажет, а Breadcrumbs/фильтр её не распознают. Дополнительная находка: в `content/catalog/categories.js` есть дублирующая запись «Грузовой крепёж» со сломанным slug `gruzovoj-kreвакpyozh` (содержит кириллицу) — похоже на случайно вставленный мусор; вне scope этой правки, помечено для следующего фикса.
- Price fix: `products.js`, товар id `'8'` (Анкер химический VMU plus 410 мл) — цена `15.24` → `1560.87`.

**Hotfix 7.2 (Category Dropdown + Filter Sidebar):**

- `CategoryDropdown.jsx` created: top dropdown panel with 2-step navigation. Step 1 shows 3 category cards with photos (hover goes red). Step 2 shows subcategory pills for selected parent with "Назад" button. Navigates to `/catalog/:category` or `/catalog/:category/:subcategory`. Closes on subcategory select, childless category select, or Escape.
- `FilterSidebar.jsx` created: left sidebar panel (slides from left, backdrop, scroll-lock). Contains sorting (4 options: price asc/desc, name A-Я, availability — applies immediately), price range filter (min/max inputs), brand filter (checkboxes), availability filter (checkbox). Staged filters applied on "Применить", cleared on "Сбросить". Filter count badge on toolbar button.
- `FilterPanel.jsx` and `FilterSheet.jsx` deleted: replaced by CategoryDropdown and FilterSidebar respectively.
- `CatalogToolbar.jsx` updated: "Каталог" button wired to CategoryDropdown toggle (chevron rotates, highlight on open). "Фильтры" button wired to FilterSidebar toggle.
- `CatalogPage.jsx` reworked: new state management with `isCategoryDropdownOpen`, `isFilterSidebarOpen`, `activeSort`, `appliedFilters` (brands/priceMin/priceMax/inStockOnly), `stagedFilters`. Filtering pipeline: URL params → brands → price range → in-stock → search → sort. Removed `useViewport` dependency (sidebar is same on all screens).
- `Breadcrumbs.jsx` unchanged (already supported 2-level from Hotfix 7.1).

**Hotfix 7.13 (Critical Audit Fixes):**

- `content/catalog/categories.js`: удалён дублирующий entry «Грузовой крепёж» со сломанным slug `gruzovoj-kreвакпpyozh` (содержал кириллицу — мусор из copy-paste). Помечалось в `AUDIT_REPORT.md` как CRITICAL. Теперь в `CATEGORY_TREE` ровно одна запись «Грузовой крепёж» со slug `gruzovoj-krepyozh`.
- `ProductCard.jsx`: исправлен поток количества при тогле корзины. Раньше `useEffect` сбрасывал `localQty=1` при выходе из корзины — пользователь видел «5» в счётчике, нажимал «В корзине», UI прыгал на «1», и при повторном «В корзину» в корзину уходило 1, а не 5. Заменён на `useRef`-механизм: пока товар в корзине, `prevCartQtyRef` запоминает текущий `cartQty`; при переходе `inCart: true → false` это значение переносится в `localQty`, и видимое количество сохраняется. Дополнительно `CartButton` теперь принимает `quantity={displayQty}` вместо `quantity={localQty}` — что видно в UI, то и уходит в `addToCart`.
- `CatalogPage.jsx`: stagger fade-in карточек сетки получил верхний потолок задержки `MAX_STAGGER_DELAY_S = 0.25`. Раньше `delay: i * 0.05` давал последнему из 16 элементов задержку 0.75с при каждом переключении страницы — пагинация ощущалась лагающей. Шаг `CARD_STAGGER_S` уменьшен с 0.05 до 0.04, и оборачивается в `Math.min(i * CARD_STAGGER_S, MAX_STAGGER_DELAY_S)`. Все три CRITICAL находки из `AUDIT_REPORT.md` закрыты.

**Hotfix 7.14 (Shared Primitives Extraction):**

- Извлечены три дублирующиеся реализации в переиспользуемые примитивы. Behavior-preserving.
- Создан `client/src/hooks/useMediaQuery.js` — generic matchMedia-хук. API: `useMediaQuery(query, ssrDefault = false) → boolean`. На SSR возвращает `ssrDefault`, на клиенте — `matchMedia(query).matches` + подписка через `addEventListener('change', ...)`. Экспортируется из `hooks/index.js`.
- Создан `client/src/components/ui/GridLines.jsx` — декоративный overlay с вертикальными колоночными линиями (разделители N колонок = N-1 линия). API: `<GridLines columns={number} color={string?} className={string?} />`. Default: `pointer-events-none absolute inset-0`, color `#d1d1d1`. Каждая линия — `absolute bottom-0 top-0` шириной 1px, left по проценту. Экспортируется из `components/ui/index.js`.
- Создан `client/src/components/ui/Checkbox.jsx` — кастомный чекбокс с скрытым нативным input для a11y. API: `<Checkbox checked indeterminate? onChange label? labelClassName? className? />`. Поддерживает indeterminate-визуал (красная полоска вместо галочки) для tree-parent с частичным выбором. Экспортируется из `components/ui/index.js`.
- Замены useIsDesktop → useMediaQuery:
  - `OurValuesSection.jsx`: локальный `useIsDesktop` (SSR=true) → `useMediaQuery('(min-width: 1024px)', true)`.
  - `CatalogBackground.jsx`: локальный `useIsDesktop` (SSR=true) → `useMediaQuery('(min-width: 1024px)', true)`.
  - `Hero.jsx`: локальный `useIsDesktop` (SSR=false) → `useMediaQuery('(min-width: 1024px)', false)`.
  - `ServiceProgramSection.jsx`: `useIsDesktop(canHover)` (width-based + canHover) → `useMediaQuery('(min-width: 1024px)', true) && canHover` (разделено на две переменные `isLarge` и `isDesktop`).
- Замены inline grid-lines → `<GridLines />`:
  - `CatalogBackground.jsx`: убран `LINE_COLOR`/loop, теперь `<GridLines columns={isDesktop ? 15 : 6} />` внутри собственного фиксированного контейнера с `bg-tagDate`.
  - `OurValuesSection.jsx`: удалён локальный `GridOverlay`, теперь `<GridLines columns={15} />` (только desktop, hardcoded 15 — как было).
- Замены inline checkbox → `<Checkbox />`:
  - `FilterAccordion.jsx` (flat-mode): локальный `Checkbox` helper удалён, теперь используется примитив из `components/ui/`.
  - `FilterAccordion.jsx` (tree-mode parent): inline tri-state разметка заменена на `<Checkbox checked={allChecked} indeterminate={someChecked && !allChecked} labelClassName="font-medium" />`.
  - `FilterAccordion.jsx` (tree-mode child): inline indented checkbox заменён на `<Checkbox className="pl-5" />`.
  - `FilterSidebar.jsx`: локальный `AvailabilityFilter` удалён, теперь `<Checkbox checked={stagedInStockOnly} onChange={onInStockToggle} label="Только в наличии" />`.
- **Правило для будущих сессий Claude Code:** при появлении ≥2 копий одной логики/JSX — извлекать в `components/ui/` или `hooks/`. Триггер из CODE_STYLE: «узко-локальный matchMedia helper допустим, но > 3 callsites → extract». Аналогично для повторяющихся UI-примитивов (чекбокс, grid-overlay).

**Wave 8 Hotfix B (Header / HeroHeader Rework):**

- Старт волны 8 (Лендинг). Header и HeroHeader: scale +20%, opacity-fade вместо translateY, reverse scroll-direction (виден когда крутишь вниз, прячется при скролле вверх), implicit freeze при открытом overlay.
- `Header.jsx`: убран `useState(scrollY)` + локальный scroll-listener, заменён на `useScrollDirection({ threshold: isHome ? window.innerHeight : 0 })`. Видимость = `(isHome ? isPastThreshold : true) && direction === 'down'`. Анимация: `transition-transform`/`translate-y-*` → `transition-opacity duration-300` + `opacity-0/100` + `pointer-events-none` при скрытии. Freeze при overlay — неявный: MobileMenu и FilterSidebar блокируют body-scroll, поэтому `useScrollDirection` не обновляется и `visible` сохраняет последнее значение (никаких ref-during-render / setState-in-effect — оба запрещены проектным ESLint).
- Scale +20% реализован минимально-инвазивно (без правки `NavPill.jsx` и `Logo.jsx`):
  - Header: контейнер `h-14` → `h-[68px]`; padding `pl-3 pr-1.5 md:pl-5 md:pr-1.5` → `pl-4 pr-2 md:pl-6 md:pr-2`; `py-1` → `py-1.5`.
  - HeroHeader: padding `px-3 py-4 md:px-8 md:py-8 lg:px-12 lg:py-12` → `px-4 py-5 md:px-10 md:py-10 lg:px-14 lg:py-14`.
  - Logo: на mobile-mark передан `size={64}` (≈54×1.2); на desktop-full `scale="sm"` → `scale="md"` (43px → 54px, ≈+25%). `Logo.jsx` не тронут.
  - NavPill: добавлена локальная константа `PILL_SCALE = 'px-4 py-2.5 text-sm md:px-6 md:py-3 md:text-base'` в каждом из двух хедеров, прокидывается через `className`. `NavPill.jsx` не тронут (он используется в CatalogToolbar — там размер не меняется).
  - IconButton (Burger / Plus): `size={48}` (40×1.2). `IconButton.jsx` не тронут.
- Overflow fix на [768, 1024): на md NAV_LINKS-пилюли скрыты (`hidden lg:inline-flex`), показываются только с lg. Lang-switcher и Аккаунт остаются видимыми на md+ (приоритет по промту). Burger / Plus продолжают давать доступ ко всей навигации через MobileMenu на любой ширине.
- `useScrollDirection.js` не тронут — существующий API `{ isPastThreshold, direction }` подошёл напрямую.
- `useUiStore.isMenuOpen` в Header не используется (явный freeze не нужен — scroll-lock обеспечивает неявный freeze).
- Build clean: vite build 1.23s, 493KB JS / 34.7KB CSS. ESLint 0/0.
- **Правило для будущих сессий Claude Code:** проектный ESLint запрещает `setState` внутри `useEffect` (cascading renders) И прямую запись/чтение `ref.current` во время render. Для derived-state, зависящего от хук-значений, использовать чистое выражение (или `useMemo`), а не паттерн «state + effect». Freeze поведения через body-scroll-lock — приемлемая неявная стратегия, не требует явного state.

**Hotfix A (Centralize Adaptive Layer via `useBreakpoint`):**

- Behavior-preserving рефакторинг адаптивного слоя. До хотфикса в `.jsx`-секциях встречались сырые литералы `'(min-width: 1024px)'` (×4 callsite: `Hero.jsx`, `OurValuesSection.jsx`, `ServiceProgramSection.jsx`, `CatalogBackground.jsx`) и локальный хук `useBreakpoint` внутри `FastenerDiagramSection.jsx`, который трижды дублировал `window.matchMedia` для порогов 768 / 1024 / 1440 px. Источник правды для Tailwind breakpoint-значений отсутствовал в JS-коде.
- Добавлен `client/src/config/breakpoints.js` — единый источник правды: `BREAKPOINTS = { sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 }` (Tailwind v3 defaults) + helper `mediaQuery(name)` → `'(min-width: <px>px)'`. Любое расхождение с `tailwind.config.js` — баг. Нестандартные пороги (1440 в Fastener-донат) сюда **не** добавлять — они остаются inline через `useMediaQuery('(min-width: 1440px)', ssrDefault)`.
- Добавлен `client/src/hooks/useBreakpoint.js` — тонкий wrapper над `useMediaQuery`, принимает `(name, ssrDefault = false)` и возвращает `boolean` (true при ширине ≥ порога). Экспорт прокинут через `client/src/hooks/index.js`.
- Мигрированы 4 callsite на `useBreakpoint('lg', ssrDefault)` с сохранением исходных SSR-defaults: `Hero.jsx` (`false`), `OurValuesSection.jsx` (`true`), `ServiceProgramSection.jsx` (`true`), `CatalogBackground.jsx` (`true`).
- `FastenerDiagramSection.jsx`: локальный `useBreakpoint`-хук удалён, заменён композицией `is1440 = useMediaQuery('(min-width: 1440px)', true)` + `isLg = useBreakpoint('lg', true)` + `isMd = useBreakpoint('md', true)` → `bp = is1440 ? 'xl' : isLg ? 'lg' : isMd ? 'md' : 'sm'`. SSR-defaults сохранены (все три на `true`, прежний компонент рендерил `'xl'` на SSR).
- API публичных компонентов и визуальное поведение не изменились. Build clean (3.64s, 509 модулей), ESLint 0/0.
- **Правило для будущих сессий Claude Code:** для проверки Tailwind breakpoint-порогов в JSX **обязательно** используется `useBreakpoint(name, ssrDefault?)` из `@/hooks`. Сырые литералы `'(min-width: 1024px)'` или локальные `window.matchMedia`-хелперы для стандартных порогов sm/md/lg/xl/2xl запрещены. Нестандартные пороги (как 1440px) разрешены только inline через `useMediaQuery` — не плодить именованные алиасы вне Tailwind-набора. SSR-default передаётся явно (`true` для UI, который должен «видеть» десктоп на сервере; `false` иначе) — это сохраняет поведение секций без layout shift.

**Hotfix 7.19 (CatalogPage Architecture Split — `useCatalogFilters`):**

- Behavior-preserving рефакторинг. Извлечён хук `client/src/hooks/useCatalogFilters.js` (265 строк), инкапсулирующий filter / sort / pagination state, pipeline и actions. CatalogPage сократился с 383 строк до 206 (UI-only orchestrator: модалки, скелетоны, JSX-композиция).
- Хук возвращает: `searchQuery`/`setSearchQuery`, `currentPage`/`setCurrentPage`, `activeSort`/`setActiveSort`, staged-черновик (`stagedBrands`, `stagedPriceMin`, `stagedPriceMax`, `stagedInStockOnly` + setters/togglers), `appliedFilters`, экшены `applyStaged` / `resetStaged` / `removeFilter(type, value?)` / `syncStagedFromApplied`, derived `pagedProducts` / `totalPages` / `activeFilterCount` / `stagedFilterCount`. Inputs хука — только `useParams()` и `useNavigate()`; URL-state не выходит за пределы `:category/:subcategory`.
- `removeFilter` унифицирован: `'category'` (navigate `/catalog`), `'subcategory'` (navigate `/catalog/{category}`), `'search'`, `'brand'` (правит и applied, и staged), `'price'` (то же), `'inStock'` (то же). Синхронизация staged + applied при снятии чипа — чтобы следующее открытие сайдбара не «оживило» удалённое условие.
- API дочерних компонентов (ActiveFilterChips, FilterSidebar, FilterAccordion, SearchBar, CatalogToolbar, CategoryDropdown, Pagination, ProductCard, ProductCardSkeleton, CatalogBackground) не модифицирован. Wiring в CatalogPage — лёгкие переходники (например `onClearSearch={() => filters.removeFilter('search')}`).
- CatalogPage оставил у себя только UI-state: `isCategoryDropdownOpen`, `isFilterSidebarOpen`, `isInitialLoading`; `useEffect` для скелетонов и scroll-to-top; tools `useMomentumLift`, `useElementHeight`.
- AUDIT_REPORT_v2 finding «CatalogPage god component (388 строк, 9 useState, 5 useCallback, 3 useEffect, 2 useMemo)» — CLOSED.
- Build clean: vite build 742ms, 492KB JS / 35.5KB CSS (без изменения относительно 7.18).
- **Правило для будущих сессий Claude Code:** страничные компоненты со множеством interdependent state hooks (5+) — кандидат на extraction в page-specific хук. Хук берёт на себя бизнес-логику (filter/sort/pagination/data shaping), страница остаётся orchestrator-ом UI (модалки, layout, скелетоны). UI-state модалок и refs остаются в компоненте — не «утаскивать» в хук, чтобы не размывать ответственность.

**Hotfix 7.18 (Polish Batch):**

- 7 независимых low-risk правок, каждая верифицируется отдельно.
- `FilterAccordion.jsx`: удалена мёртвая tree-ветка (≈70 строк). После Hotfix 7.1 дерево категорий вынесено в CategoryDropdown; FilterSidebar передаёт только flat-списки (бренды, наличие). Grep по `isTree` пусто. Prop `isTree` удалён из propTypes. API `Checkbox` (indeterminate, labelClassName) не тронут — reusable примитив.
- `_TaglineLine.jsx`, `OurValuesSection.jsx`, `FastenerDiagramSection.jsx`, `MobileMenu.jsx`: добавлены guard'ы `useReducedMotion()`. При `prefers-reduced-motion: reduce`:
  - Tagline дегрейдится до opacity-only (без y-drift и blur); firstEnter становится мгновенным.
  - OurValues scroll-driven диагональ отключается (карточки в финальной статичной позиции); mobile stagger обнуляется.
  - FastenerDiagram skate+grow пропускается (progress.set в конец), flag-labels проявляются одновременно, DecoRings без масштаба.
  - MobileMenu curtain пропускается (`curtainDone = true` сразу), staggered fadeIn без задержек.
  - Финальное состояние всегда достижимо, никаких скрытых элементов.
- `Header.jsx`: `useState(window.scrollY)` → `useState(0)` + sync через существующий useEffect. SSR-safe.
- `tailwind.config.js`: добавлен `safelist: ['bg-gridLine']` на корневом уровне — страховка для GridLines.jsx default-класса.
- `CatalogPage.jsx`: inline `style={{ display: 'grid', gridTemplateColumns: '...' }}` (дублировался в skeleton-grid и real-grid) вынесен в const `GRID_STYLE` сверху файла.
- `Pagination.jsx`: все кликабельные элементы (prev/next стрелки + page-кнопки) получили `flex h-11 min-w-11` (44×44 px) — WCAG 2.5.5 touch-target.
- Магические числа аннотированы русскими комментариями в `Logo.jsx` (6 ratio-коэффициентов), `FastenerDiagramSection.jsx` (sector-pad i===2:85), `OurValuesSection.jsx` (3 slope-коэффициента в clamp).
- Build clean: 3.68s, 491KB JS / 35.5KB CSS.
- **Правило для будущих сессий Claude Code:** любая новая motion-секция с не-opacity-анимациями обязана пройти через `useReducedMotion()` guard. Финальное состояние должно достигаться при reduced — нельзя оставлять элементы невидимыми.

**Hotfix 7.17 (Z-Toolbar Wiring — REVERTED):**

- Попытка завершить миграцию CatalogToolbar с `z-hero` на `z-toolbar` (50), начатую в Hotfix 7.15 (там был добавлен токен и doc-комментарий, но JSX остался на `z-hero`). Источник — AUDIT_REPORT_v2.md, Phase 1, finding 1.6 (dropdown clipping by dark section peek).
- **Откатано после реального тестирования.** С `z-toolbar=50 > z-wrapper=10` ломался основной паттерн каталога: toolbar играет «роль Hero» (как `Hero.jsx` z=1 на лендинге), и тёмная каталог-секция (`motion.section` z=10 с `style={{ y: lift }}`) должна **накрывать** его при скролле. С z=50 toolbar зависал поверх `bg-navy`-секции в диапазоне `scrollY ∈ [40vh, 100vh]` — белая пилюля над тёмной секцией. `visibility:hidden` при `scrollY >= 100vh` — это бэкап для блокировки кликов, а не для визуального скрытия.
- Audit-находка 1.6 (clipping dropdown'а нижней частью peek'а тёмной секции на scrollY=0) — теоретическая. CategoryDropdown в реальности — 3 карточки категорий или ряд плиток, его высота не достигает peek-зоны (10vh снизу при scrollY=0). Правильное решение для гипотетического случая больших dropdown'ов — `createPortal` отдельно от toolbar'а; внесение токена `z-toolbar` всему root-элементу — слишком грубый инструмент.
- Изменения:
  - `CatalogToolbar.jsx:38`: `z-toolbar` → `z-hero` (восстановлено состояние Hotfix 7.6).
  - `tailwind.config.js`: токен `toolbar: '50'` удалён из `zIndex`-объекта; строка `// toolbar (50) — CatalogToolbar` убрана из doc-комментария; doc-строка про `hero` восстановлена в форме `// hero (1) — Hero на лендинге, Toolbar в каталоге` (была опечатка `лендингею` от предыдущего неполного редактирования).
- **Правило для будущих сессий Claude Code:** при появлении audit-находки про z-stacking всегда проверять геометрию скролла **до** изменения токенов — bg-секции могут зависеть от низкого z-index toolbar/Hero как от ФИЧИ, а не бага. Если audit нашёл «clipping dropdown'а» — фиксить точечно (Portal, локальный stacking), а не поднимать z всего родителя.

**Hotfix 7.15 (Tailwind Tokens + Z-Stack Centralization):**

- Поведение не изменено — только источник правды для z-индексов, цветов и кривых анимации.
- `tailwind.config.js`: добавлен токен `gridLine: '#d1d1d1'`; удалён неиспользуемый `photoPlaceholder` (audit подтвердил отсутствие callsites); добавлена шкала `zIndex` в `theme.extend` (`hero/wrapper/toolbar/header/topstrip/filterBackdrop/filterPanel/menu`) с комментарием-доками. Стандартные Tailwind z-утилиты (`z-0`, `z-10`, `z-20`, `z-30`, `z-40`, `z-50`, `z-auto`) сохранены через `extend`.
- `GridLines.jsx`: API упрощён. Был `color` prop (hex через inline-style) → стал `colorClass` prop (Tailwind-класс), default `bg-gridLine`. Существующие call-sites (`CatalogBackground.jsx`, `OurValuesSection.jsx`) не передают prop — автоматически используют новый default.
- `useMomentumLift.js`: `AMPLITUDE_PX = 100` теперь экспортируется. Реэкспорт добавлен в `hooks/index.js`.
- `CatalogPage.jsx`: удалён локальный `SPRING_OVERSHOOT_PAD_PX`, теперь `paddingBottom: AMPLITUDE_PX` импортируется из `@/hooks`. Padding и амплитуда пружины синхронизированы через единственный источник правды.
- Замены z-классов на named tokens:
  - `z-[1]` → `z-hero` в `Hero.jsx`, `CatalogToolbar.jsx`.
  - `z-10` → `z-wrapper` в `Home.jsx` (landing motion.section) и `CatalogPage.jsx` (catalog motion.section).
  - `z-[100]` → `z-header` в `Header.jsx`.
  - `z-[200]` → `z-topstrip` в `TopStrip.jsx`.
  - `z-[500]` → `z-filterBackdrop`, `z-[501]` → `z-filterPanel` в `FilterSidebar.jsx`.
  - `z-[1000]` → `z-menu` в `MobileMenu.jsx`.
  - Локальные z-классы внутри стек-контекстов оставлены как есть (Hero overlay `z-[1]` / content `z-[2]`, MobileMenu внутренние слои `z-0`/`z-[1]`, FastenerDiagramSection `z-[2]`, ProductCard heart/brand `z-10`, HeroHeader root `z-10`, OurValuesSection внутренние `z-10`, CategoryDropdown wrapper `z-40` внутри toolbar, ScrollToTopButton FAB `z-50`, Footer `z-0`, CatalogBackground `z-0`).
  - `z-[150]` (lang-dropdown в Header.jsx и HeroHeader.jsx) — не маппится на шкалу, оставлен как arbitrary; уникальный case «выше Header, ниже TopStrip».
- Замены `cubic-bezier(0.4,0,0.2,1)` → `ease-in-out` (эквивалент по спецификации Tailwind):
  - `Header.jsx:76`, `Button.jsx:66`, `Button.jsx:86`, `IconButton.jsx:71`, `_MenuItem.jsx:60`.
  - Нестандартные кривые сохранены inline: `cubic-bezier(0.22, 1, 0.36, 1)` в `NumbersSection.jsx`, `cubic-bezier(0.55,0,0.9,0.4)` в `Button.jsx` (swap-анимация стрелки).
- **Правило для будущих сессий Claude Code:** z-индексы и любые повторяемые значения цвета/тайминга — только через токены в `tailwind.config.js`. Arbitrary `z-[N]` допустим только для one-off локальных стек-контекстов; для глобального стека — `z-hero / z-wrapper / z-toolbar / z-header / z-topstrip / z-filterBackdrop / z-filterPanel / z-menu`. Кривая `cubic-bezier(0.4,0,0.2,1)` ≡ `ease-in-out` — не дублировать inline.

**Hotfix 7.11 (Single Source of Truth Refactor):**

- Audit findings:
  - `BREADCRUMB_LABELS` (плоский словарь slug → label) был объявлен в `content/catalog/categories.js` и импортирован в `ActiveFilterChips.jsx` и `Breadcrumbs.jsx`. Дублировал данные, уже присутствующие в `CATEGORY_TREE` — при добавлении категории/подкатегории в дерево чип/крошка не появлялись (root cause бага «не показывается чип на новой категории»).
  - Хардкод slug'ов / Russian-лейблов / брендов в `.jsx` — не найдено.
  - `CategoryDropdown.jsx` уже итерирует `CATEGORY_TREE`, без хардкод-веток.
  - `FilterSidebar.jsx` уже импортирует `BRANDS`, без хардкода.
  - В `CatalogPage.jsx` были inline-вызовы `CATEGORY_TREE.find(...)` для lookup'а категории/подкатегории — переведены на helpers (без смены семантики фильтрации).
- Создан `client/src/content/catalog/helpers.js` с чистыми утилитами:
  - `findCategoryBySlug(slug) → Category | null`
  - `findSubcategoryBySlug(slug) → { parent, subcategory } | null`
  - `getCategoryLabel(slug) → string | null` — работает и для top-level, и для подкатегорий.
  - `getCategoryBreadcrumbPath(categorySlug, subcategorySlug) → [{ label, slug }, ...]`
  - Зарезервировано на будущее (добавляется вместе с UI, который их использует): `getProductCountForCategory`, `getProductCountForSubcategory`, `getProductCountForBrand` — счётчики «(N)» для `CategoryDropdown` и `FilterSidebar`.
- `BREADCRUMB_LABELS` удалён из `categories.js` и из re-export'ов `index.js`. `index.js` добавляет `export * from './helpers'`.
- `ActiveFilterChips.jsx`: импорт `BREADCRUMB_LABELS` → `getCategoryLabel`; lookup'ы лейбла для chip'а категории/подкатегории идут через helper. Теперь чип появляется для ЛЮБОГО slug'а, присутствующего в `CATEGORY_TREE`.
- `Breadcrumbs.jsx`: переписан под `getCategoryBreadcrumbPath`. Линки в крошках формируются из `segment.slug` дерева.
- `CatalogPage.jsx`: inline `CATEGORY_TREE.find(...)` → `findCategoryBySlug` / `findSubcategoryBySlug`. Импорт `CATEGORY_TREE` убран (не использовался напрямую).
- **Правило для будущих сессий Claude Code:** контент каталога (категории, подкатегории, бренды, товары) живёт ТОЛЬКО в `src/content/catalog/`. Компоненты обязаны брать все лейблы, slug'и и счётчики из `CATEGORY_TREE` / `BRANDS` / `PRODUCTS` через helpers из `helpers.js`. Добавление новой категории/подкатегории/бренда/товара в content-файл НИКОГДА не должно требовать редактирования `.jsx`. Если приходится захардкодить slug или label в `.jsx` — это баг.

---

## Wave 9 — Полировка лендинга, Lenis, entrance-анимации (по git, май 2026)

Дописано по git-истории (коммиты после Wave 8 Hotfix B). Этот блок раньше не попадал
в документацию; добавлен, чтобы журнал соответствовал реальному коду. Порядок —
хронологический (от раннего к позднему).

**Полировка секций — divider / CTA / Partners (`dd038fa`, 25 мая):**

- `ServiceProgramSection`: подчёркивание строк заменено с `border-b` на абсолютный `div h-px` (прямая линия без скруглений по краям rounded-контейнера); divider исчезает (`opacity-0`) при наведении на свою строку.
- `CtaBannerSection`: высота баннера +20%, заголовок +30%, на 320px высота увеличена в 1.5 раза.
- `PartnersSection`: добавлен заголовок секции «Наши партнёры», логотип партнёра в карточке +30%, gap между тегами /2, увеличены заголовок и подзаголовок карточки.

**OurValues — убран spring-lag (`7658f36`, 25 мая):**

- Из scroll-driven цепочки карточек удалён `useSpring`: было `useScroll → useSpring → useTransform → motion.div`, стало `useScroll → useTransform → motion.div`. Карточки следуют за скроллом 1:1 без инерции; точка привязки синхронизирована с триггером. Reduced-motion guard сохранён.

**SupportButton (`ddabb76`, 25 мая):**

- `SupportButton.jsx` создан в `components/ui/`: фиксированная кнопка «Поддержка» в правом нижнем углу на роуте `/`. Desktop — красный pill с иконкой + текст + круглая стрелка (dual-arrow анимация из `Button.jsx`, повёрнута −90°, hover через Tailwind `group`); mobile — компактная квадратная кнопка без текста. Видимость: появляется после прохождения Hero, скрывается у Footer. Z-index `z-header`. Иконка — `public/icons/support_icon.svg`.

**Lenis вместо momentum-lift (`a22f691`, 25 мая):**

- Удалён `useMomentumLift` (translateY-обёртка wrapper'а со spring-эффектом — вызывала «дёргание» при быстром скролле). `motion.section` с `y={lift}` заменён на обычный `<section>` в `Home.jsx` и `CatalogPage.jsx`; `AMPLITUDE_PX` и `paddingBottom`-компенсация удалены.
- Установлен `lenis@^1.3.23`. Создан `useLenis` — глобальная инициализация с RAF-loop, вызывается в `App.jsx` (все роуты). При `prefers-reduced-motion: reduce` Lenis не инициализируется (нативный скролл). `lenis/dist/lenis.css` подключён в `main.jsx`.
- **Следствие для документации:** прежние записи про `useMomentumLift` (Phase 4B, Hotfix 7.15) описывают удалённый код — актуальный механизм скролла теперь Lenis.

**Logo redesign + размеры шапки + scope scroll-direction (`7df68b9`, 25 мая):**

- `Logo` (Header / HeroHeader / Footer): подпись CORPORATE CONSTRUCTION — `#fff` для `theme=light`, чёрная для `theme=dark`; убран `font-weight 700` у «Fastener» (одинаковый вес с «Direct»); расстояние между «Fastener Direct» и подписью /2; desktop — основной текст 26px, подпись 10px, иконка 50×50; mobile — иконка 40×40.
- `NavPill`: высота +8px, font-size 16px. `IconButton`: высота +8px (выровнен с NavPill).
- На каталоге и других не-Home роутах Header всегда виден (scroll-direction-логика скрытия не применяется). `SupportButton`: добавлено условие `direction === 'down'` в visibility.

**Border-radius / теги / стрелка ServiceProgram (`ba8c97a`, 25 мая):**

- CTA-banner и карточки Partners: `rounded-3xl → rounded-xl` (12px) на корневом блоке, фото- и лого-контейнере. Теги Partners: padding `6px 12px → 0px 8px`. `ServiceProgramSection`: добавлена dual-arrow swap-анимация на кнопку-стрелку при hover (CSS-only, паттерн из `Button.jsx` через Tailwind `group`); существующий slide-in кнопки сохранён.

**TopStrip slide-in (`27ef49e`, 25 мая):**

- При первой загрузке красная полоса растёт слева направо за 1.5с (`scaleX 0 → 1`, `origin-left`, easeOut). При SPA-навигации не повторяется (`TopStrip` смонтирован один раз вне `Routes`). При reduced-motion появляется мгновенно (`initial={false}`).

**Извлечение HeroHeader из Hero (`e2467d2`, 25 мая):**

- `HeroHeader` вынесен из `Hero.jsx` в `Home.jsx` — рендерится только на Home без `useLocation`-гейтинга. Позиционирование `fixed top-0 z-header`. При скролле `translateY = -scrollY` (`useScroll → useTransform`) — уезжает вверх синхронно с потоком; при `scrollY ≈ 80–120px` полностью за верхним краем, overlap с обычным Header исключён.
- Header и SupportButton: threshold `window.innerHeight → window.innerHeight / 2`. На каталоге и не-Home Header виден всегда.
- **Следствие для документации:** прежнее «HeroHeader живёт внутри dummy-Hero, в Phase 4 переедет внутрь Hero» более не актуально — HeroHeader самостоятельный компонент, dummy-Hero удалён.

**Entrance-анимации всех секций лендинга (`0297905`, 26 мая):**

- Hero (mount-based): Faste/Direct fade-up `t=0`; tagline `initialDelay=100ms` через prop в `_TaglineLine` (6-фазная state machine сохранена); HeroHeader — Logo `t=200ms`, далее кнопки stagger 100ms.
- Секции (`whileInView`, `once: true`): OurValues (название → текст → кнопка; scroll-driven карточки не тронуты); ServiceProgram (название → карточки stagger 100ms); FastenerDiagram (только название, donut не тронут); Numbers (цифры синхронно + count-up); Partners (заголовок → row-stagger); CtaBanner (текст + фото `scale 1.05→1.0`, кнопка `t=100ms`).
- Общие параметры: 600ms, easeOut, stagger 100ms. Reduced-motion: `initial={false}`. Удалён orphaned `STAGGER_DELAY_S` из `content/numbers.js`.

**Hero — путь постера + loop fallback (`53ce2d7`, 26 мая):**

- Исправлен путь постера видео (`factory_bg-poster.png` → `factory_bg-page.png`). Добавлен `onEnded`-обработчик как fallback для `loop` (в Chrome/Safari атрибут `loop` иногда не срабатывает с некоторыми кодеками). Заменён файл видео. Удалён `AUDIT_REPORT_v2.md` из корня.

**Hotfix K.2 — редизайн CTA-баннера (`b2201b8`, 26 мая):**

- Ширина выровнена с Partners (`lg:px-10`, `max-w-[1347px]`); фикс высоты desktop (убран aspect-ratio, `md:h-[560px]`); заголовок 56px desktop / 48px md / 36px mobile, `leading-[1.15]`; текстовый контейнер `max-w-[1050px]`; overlay `black/55` заменён на `color-mix(in oklab, #2e3f51 40%, transparent)`.

**Hotfix K.3 — scroll-driven цвет слов + ресайз заголовка OurValues (`0045a36`, 26 мая):**

- Слова заголовка разбиты на `<motion.span>`, каждое интерполирует цвет `#fff → #2E3F51` через `useTransform` на общем `scrollYProgress`; `useScroll offset ['start 0.90', 'end 0.6']`. Reduced-motion / mobile (<lg) — статический `#2E3F51`. Desktop heading: явная ширина 890px, `marginLeft -50px`, `leading-[1.1]`, font-size 64 → `xl:76` → `2xl:88`px; mobile 36 → `md:42`px. CTA «В каталог» на desktop → `size="lg"`.

**Hotfix K.1b — per-pair entrance + count-up в NumbersSection (`96f4e83`, 26 мая):**

- Единый section-wide `useInView` заменён на два per-row observer (`row1Ref`/`row2Ref`): каждая визуальная пара (`STATS_ROW1`, `STATS_ROW2`) триггерит свой entrance + count-up независимо. Внутри пары счётчики стартуют/финишируют синхронно. Desktop viewport amount `0.3 → 0.8` (mobile 0.2). Инвариант синхронизации линии сохранён (`LINE_START_DELAY` выводится из `COUNT_DURATION − LINE_DURATION`); `numbers.js` не тронут; `StatItem` без изменений.

**Переработка комментариев (`e616dac`, 28 мая):**

- Массовая чистка/переработка комментариев по всему `client/src` (74 файла): приведение к проектному стилю (русский, по делу). Удалён неиспользуемый `Breadcrumbs.jsx` из `components/catalog/` (был оставлен «на будущее» в Hotfix 7.6).

**Прочее (`c7b1f98` / `1c79202` / `33cf20e`, 30 мая):**

- `build(deps)`: добавлен `@anthropic-ai/claude-code` (скрипт `claude` в root и `client/package.json`).
- Footer: YouTube-ссылка заменена с плейсхолдера `#` на реальный URL канала.
- `useCatalogFilters`: удалены устаревшие комментарии (EMPTY_FILTERS, ITEMS_PER_PAGE).

---

## Приложение: раздел «Что не сделано» (исторический снимок)

Текст ниже перенесён из `PROJECT_CONTEXT.md` **дословно**. На момент переноса (Wave 9) он
уже **устарел**: Phase 4 (Hero / HeroHeader) и каталог реализованы. Актуальный статус
«что готово / что следующее» — в разделе «Текущее состояние» `PROJECT_CONTEXT.md`.
Сохранено для полноты истории.

## Что не сделано

**Phase 4 (next, in progress):**

- Реальный компонент `Hero.jsx` с видео-фоном (`/video/factory_bg.mp4`), momentum-параллаксом и скролл-сценарием.
- Перенос `HeroHeader` из dummy-Hero placeholder'а в `Home.jsx` внутрь компонента Hero.
- Удаление dummy-Hero placeholder'а из `Home.jsx`, замена на `<Hero />`.
- Согласование `Header` ↔ `HeroHeader` ↔ scroll-trigger: над Hero-секцией виден `HeroHeader`, при прокрутке ниже Hero — `Header` появляется в светлой теме (через `useScrollDirection` с `threshold = window.innerHeight` или эквивалент).

**Phase 5–6:**

- Остальные секции лендинга: Reviews.
- Сборка финального лендинга в `Home.jsx` (удаление playground'а).
- Остальные роуты (`/catalog`, `/about`, `/contacts` и т.д.).

**Backend / Infra:**

- Drizzle-схемы (таблицы из раздела 8).
- Auth (регистрация / вход).
- Docker-образы для `client` и `server`.
- S3-интеграция для пользовательского / админ-контента.
