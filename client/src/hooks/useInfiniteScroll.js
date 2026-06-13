// Бесконечная подгрузка через IntersectionObserver: следит за sentinel-элементом в
// конце списка и вызывает onLoadMore при его появлении в зоне видимости.
import { useEffect, useRef } from 'react'

// Упреждающий отступ от viewport — догружаем порцию ещё до того, как sentinel виден.
const ROOT_MARGIN = '300px'

/**
 * Подключает бесконечную подгрузку: наблюдает за sentinel-элементом и при его
 * пересечении с viewport (с упреждающим rootMargin) вызывает onLoadMore. Когда
 * enabled = false (всё загружено), observer не создаётся, а уже созданный
 * отключается через cleanup. Без scroll-listener — легче для слабых устройств и
 * совместимо с Lenis (IntersectionObserver считает пересечение от viewport).
 *
 * @param {() => void} onLoadMore - Коллбэк догрузки следующей порции.
 * @param {boolean} enabled - Наблюдать ли sentinel (false → observer отключён).
 * @returns {import('react').RefObject<HTMLDivElement>} - Ref для sentinel-элемента.
 */
export default function useInfiniteScroll(onLoadMore, enabled) {
  const sentinelRef = useRef(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!enabled || !sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) onLoadMore()
      },
      { rootMargin: ROOT_MARGIN }
    )
    observer.observe(sentinel)

    return () => observer.disconnect()
  }, [onLoadMore, enabled])

  return sentinelRef
}
