// src/components/sections/TopStrip.jsx
//
// Тонкая красная полоса 3px поверх всего. Декоративная, не интерактивная.
// z-200 — выше Header (z-100), но ниже MobileMenu (z-1000).

/**
 * Декоративная красная полоса 3px фиксированная сверху страницы.
 */
function TopStrip() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 right-0 top-0 z-[200] h-[3px] bg-red"
    />
  )
}

export default TopStrip
