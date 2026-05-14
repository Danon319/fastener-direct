export const CATEGORY_TREE = [
  {
    label: 'Строительный крепёж',
    slug: 'stroitelnyj-krepyozh',
    image: '/product_category/construction_fasteners.jpg',
    children: [
      { label: 'Анкеры', slug: 'ankery', categoryKey: 'anchor' },
      { label: 'Болты', slug: 'bolty', categoryKey: 'bolt' },
      { label: 'Винты', slug: 'vinty', categoryKey: 'screw' },
      { label: 'Гайки', slug: 'gaiki', categoryKey: 'nut' },
    ],
  },
  {
    label: 'Химический крепёж',
    slug: 'himicheskij-krepyozh',
    image: '/product_category/сhemical_fasteners.jpg',
    children: [
      { label: 'Химические анкера', slug: 'himicheskie-ankera', categoryKey: 'chemical-anchor' },
      { label: 'Герметик и силикон', slug: 'germetik-i-silikon', categoryKey: 'sealant' },
      { label: 'Монтажная пена', slug: 'montazhnaya-pena', categoryKey: 'foam' },
      { label: 'Жидкие гвозди', slug: 'zhidkie-gvozdi', categoryKey: 'liquid-nails' },
    ],
  },
  {
    label: 'Грузовой крепёж',
    slug: 'gruzovoj-krepyozh',
    image: '/product_category/сargo_fasteners.jpg',
    children: [],
  },
]

export const BREADCRUMB_LABELS = {
  'stroitelnyj-krepyozh': 'Строительный крепёж',
  ankery: 'Анкеры',
  bolty: 'Болты',
  vinty: 'Винты',
  gaiki: 'Гайки',
  'himicheskij-krepyozh': 'Химический крепёж',
  'himicheskie-ankera': 'Химические анкера',
  'germetik-i-silikon': 'Герметик и силикон',
  'montazhnaya-pena': 'Монтажная пена',
  'zhidkie-gvozdi': 'Жидкие гвозди',
  'gruzovoj-krepyozh': 'Грузовой крепёж',
}
