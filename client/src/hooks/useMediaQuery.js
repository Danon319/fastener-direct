import { useCallback, useSyncExternalStore } from 'react'

/**
 * Хук для отслеживания CSS media query через window.matchMedia.
 *
 * На сервере (typeof window === 'undefined') возвращает ssrDefault.
 * На клиенте — текущее значение matches, подписывается на изменения через
 * useSyncExternalStore (рекомендованный React-паттерн для внешних источников).
 *
 * @param {string} query - Медиа-запрос, например '(min-width: 1024px)'.
 * @param {boolean} [ssrDefault=false] - Значение для SSR-рендера.
 * @returns {boolean} - matches.
 */
export default function useMediaQuery(query, ssrDefault = false) { //ssrDefault = false - на будущее
  const subscribe = useCallback(
    (callback) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', callback)
      return () => mql.removeEventListener('change', callback)
    },
    [query]
  )

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query])
  const getServerSnapshot = useCallback(() => ssrDefault, [ssrDefault])

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
