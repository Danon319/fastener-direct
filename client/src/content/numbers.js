/** Длительность анимации счётчика, мс. */
export const COUNT_DURATION = 1800

/** Длительность анимации вертикальной линии, мс. */
export const LINE_DURATION = 700

/** Задержка каскада между элементами статистики, с. */
export const STAGGER_DELAY_S = 0.15

/**
 * Строка статистики: число, суффикс, подпись.
 * @typedef {{ value: number, suffix: string, label: string }} Stat
 */

/**
 * Статистика в строке 1 (верхний ряд).
 * @type {Stat[]}
 */
export const STATS_ROW1 = [
  { value: 6, suffix: '', label: 'партнёров-заводов' },
  { value: 500, suffix: '+', label: 'постоянных клиентов' },
]

/**
 * Статистика в строке 2 (нижний ряд, сдвиг вправо на десктопе).
 * @type {Stat[]}
 */
export const STATS_ROW2 = [
  { value: 24, suffix: 'ч', label: 'среднее время отгрузки' },
  { value: 12, suffix: ' лет', label: 'на рынке' },
]
