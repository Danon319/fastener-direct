/**
 * Единый источник правды для значений Tailwind breakpoint'ов в JS-коде.
 *
 * Значения тут ОБЯЗАНЫ совпадать с Tailwind v3 defaults — иначе CSS-адаптив
 * (классы `md:`, `lg:` и т.п.) разойдётся с JS-вычислениями useBreakpoint.
 * Это не «настройка проекта», а отражение конфигурации Tailwind as-is.
 */

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}

/**
 * Возвращает CSS media query вида '(min-width: Npx)' по имени breakpoint'а.
 *
 * @param {'sm' | 'md' | 'lg' | 'xl' | '2xl'} name - Имя Tailwind breakpoint'а.
 * @returns {string}
 * @throws {Error} Если имя не найдено в BREAKPOINTS.
 */
export function mediaQuery(name) {
  const px = BREAKPOINTS[name]
  if (typeof px !== 'number') {
    throw new Error(`Unknown breakpoint: ${name}`)
  }
  return `(min-width: ${px}px)`
}
