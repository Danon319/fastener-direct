import containerQueries from '@tailwindcss/container-queries'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  // Гарантируем сохранение класса в bundle: GridLines.jsx использует bg-gridLine как
  // default-значение prop'а. Если его когда-нибудь поменяют на computed-выражение,
  // JIT перестанет видеть литерал — safelist страхует.
  safelist: ['bg-gridLine'],
  theme: {
    extend: {
      colors: {
        red: '#d03328',
        redHover: '#7c1e18',
        navy: '#1c2024',
        slate: '#2e3f51',
        slateHover: '#768597',
        light: '#ECEEF0',
        footerBg: '#161a1d',
        muted: '#6b7a8a',
        card: '#f3f5f7',
        tagDate: '#e4e8ec',
        divider: '#d9dde1',
        pillHover: '#cccccc',
        gridLine: '#d1d1d1',
      },
      // Тени-токены — единый источник правды вместо дублей arbitrary shadow-[...].
      // popover — поповеры тулбара (фильтры/сортировка/категории); btn — CTA-кнопка.
      boxShadow: {
        popover: '0 8px 28px rgba(0,0,0,0.18)',
        btn: '0 2px 14px rgba(0,0,0,0.12)',
      },
      fontFamily: {
        sans: ['"Neue Montreal"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      // Интринзик-грид каталога: число колонок выводится из ширины контейнера, а не задаётся
      // лесенкой брейкпоинтов. minmax(280px, 1fr) держит единый размер карточки на любом экране
      // (меняется только количество колонок). auto-fill (не auto-fit) — неполный ряд не растягивает
      // карточки. При max-w-[1800px] на 2560px выходит ровно 6 колонок по ~285px.
      gridTemplateColumns: {
        cards: 'repeat(auto-fill, minmax(280px, 1fr))',
      },
      // Z-стек проекта (от низкого к высокому):
      // hero (1) — Hero на лендинге, Toolbar в каталоге
      // wrapper (10) — momentum-lift секции (Home wrapper, catalog dark section)
      // header (100) — fixed Header
      // topstrip (200) — TopStrip
      // filterBackdrop (500) / filterPanel (501) — FilterSidebar
      // menu (1000) — MobileMenu (выше всего)
      zIndex: {
        hero: '1',
        wrapper: '10',
        header: '100',
        topstrip: '200',
        filterBackdrop: '500',
        filterPanel: '501',
        menu: '1000',
      },
    },
  },
  plugins: [containerQueries],
}
