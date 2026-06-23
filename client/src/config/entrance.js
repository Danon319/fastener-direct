/**
 * Единый источник правды для канона entrance-анимации (fade + сдвиг снизу).
 *
 */

// Длительность появления (сек).
export const ENTRANCE_DURATION = 0.9
// Плавность: мягко выплывает снизу.
export const ENTRANCE_EASE = [0.22, 1, 0.36, 1]
// Начальный сдвиг вниз (px), от которого элемент поднимается к 0.
export const ENTRANCE_Y = 40
// Шаг задержки между соседними элементами при stagger (сек).
export const ENTRANCE_STAGGER = 0.1
