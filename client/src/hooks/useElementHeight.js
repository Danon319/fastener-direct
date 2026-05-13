// src/hooks/useElementHeight.js
//
// Returns the border-box height of a DOM element via ResizeObserver.
// Accepts a CSS selector string (e.g. 'footer') to locate the element.
// Used by Home.jsx to size the footer-spacer to match the fixed Footer.

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
