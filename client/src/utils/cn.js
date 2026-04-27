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
