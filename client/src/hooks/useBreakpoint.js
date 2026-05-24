import { mediaQuery } from '@/config/breakpoints'

import useMediaQuery from './useMediaQuery'

/**
 * Тонкий wrapper над useMediaQuery с именованным API Tailwind breakpoint'ов.
 *
 * @example
 *   const isDesktop = useBreakpoint('lg') // true при ширине окна ≥ 1024px
 *
 * @param {'sm' | 'md' | 'lg' | 'xl' | '2xl'} name - Имя Tailwind breakpoint'а.
 * @param {boolean} [ssrDefault=false] - Значение для SSR-рендера.
 * @returns {boolean}
 */
export default function useBreakpoint(name, ssrDefault = false) {
  return useMediaQuery(mediaQuery(name), ssrDefault)
}
