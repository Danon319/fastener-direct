// Возвращает высоту DOM-элемента по CSS-селектору через ResizeObserver. Используется для отступа под фиксированный Footer.

import { useEffect, useState } from 'react'

/**
 * Отслеживает высоту DOM-элемента, найденного по CSS-селектору.
 * Использует ResizeObserver — обновляет значение при изменении размеров элемента.
 *
 * @param {string} selector - CSS-селектор элемента, например 'footer'.
 * @returns {number} - Высота элемента в пикселях (border-box).
 */
export default function useElementHeight(selector) {
  const [height, setHeight] = useState(0)

  useEffect(() => {
    const el = document.querySelector(selector)
    if (!el) return

    const timer = setTimeout(() => setHeight(el.offsetHeight), 0)

    const ro = new ResizeObserver(([entry]) => {
      setHeight(entry.borderBoxSize?.[0]?.blockSize ?? el.offsetHeight)
    })
    ro.observe(el)
    return () => {
      clearTimeout(timer)
      ro.disconnect()
    }
  }, [selector])

  return height
}
