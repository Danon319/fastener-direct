/** Count-up animation duration in ms. */
export const COUNT_DURATION = 1800

/** Vertical line animation duration in ms. */
export const LINE_DURATION = 700

/** Stagger delay between stat items in seconds. */
export const STAGGER_DELAY_S = 0.15

/**
 * @typedef {{ value: number, suffix: string, label: string }} Stat
 */

/**
 * Stats displayed in row 1 (top row).
 * @type {Stat[]}
 */
export const STATS_ROW1 = [
  { value: 6, suffix: '', label: 'партнёров-заводов' },
  { value: 500, suffix: '+', label: 'постоянных клиентов' },
]

/**
 * Stats displayed in row 2 (bottom row, offset right on desktop).
 * @type {Stat[]}
 */
export const STATS_ROW2 = [
  { value: 24, suffix: 'ч', label: 'среднее время отгрузки' },
  { value: 12, suffix: ' лет', label: 'на рынке' },
]
