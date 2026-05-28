// Данные и константы для круговой диаграммы в блоке о клиентах.

export const TITLE = 'Fastener Direct: Наши клиенты'

export const sectors = [
  { label: 'Гос. Заказы', pct: 24.9, color: '#d03328' },
  { label: 'Юр. Лица', pct: 12.6, color: '#CDCDCD' },
  { label: 'Компании', pct: 20.1, color: '#7BA5BE' },
  { label: 'Мастера', pct: 18.5, color: '#92B4C8' },
  { label: 'Оптовики', pct: 17.2, color: '#5E8EA8' },
  { label: 'Розница', pct: 6.7, color: '#6B7A85' },
]

export const IR = 240
export const OR = 260
export const R_STROKE = (IR + OR) / 2 // 250
export const STROKE_WIDTH = OR - IR // 20
export const CX = 350
export const CY = 350
export const SIZE = 700

export const DECO_RINGS = [{ r: OR + 280 }, { r: OR + 280 + 280 }, { r: OR + 280 + 280 + 280 }]

export const INTRO_DURATION = 0.5
export const RING_STAGGER = 0.15
export const POLOS_WIDTH = 10
export const OMEGA_SKATE = 600
export const OMEGA_GROW = 240
export const OVERLAP = 0.6

// Цвет контура кольца (белый ~12% непрозрачности).
export const RING_COLOR = '#ffffff1f'
