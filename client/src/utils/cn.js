import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Объединяет классы Tailwind, правильно рещая конфликты
 * (например, если в один элемент попадут `p-2` и `p-4` — останется `p-4`).
 *
 * @param {...any} inputs - Классы, объекты, массивы, falsy-значения.
 * @returns {string}
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
