import { useEffect, useState } from 'react'

/**
 * Хук для отслеживания CSS media query через window.matchMedia.
 *
 * На сервере (typeof window === 'undefined') возвращает ssrDefault.
 * На клиенте — текущее значение matches, подписывается на изменения.
 *
 * @param {string} query - Медиа-запрос, например '(min-width: 1024px)'.
 * @param {boolean} [ssrDefault=false] - Значение для SSR-рендера.
 * @returns {boolean} - matches.
 */
export default function useMediaQuery(query, ssrDefault = false) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return ssrDefault
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    const mql = window.matchMedia(query)
    const handleChange = (e) => setMatches(e.matches)
    // Синхронизация на случай если значение изменилось между initial render и mount.
    setMatches(mql.matches)
    mql.addEventListener('change', handleChange)
    return () => mql.removeEventListener('change', handleChange)
  }, [query])

  return matches
}
