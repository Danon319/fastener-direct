// src/hooks/useElementHeight.js
//
// Возвращает высоту элемента по border-box через ResizeObserver.
// Принимает строку CSS-селектора (например 'footer') для поиска элемента.
// Используется в Home.jsx: отступ под фиксированный подвал по высоте Footer.

import { useEffect, useState } from 'react'

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
