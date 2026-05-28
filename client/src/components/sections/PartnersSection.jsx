// Секция партнёров-производителей: адаптивная auto-fit сетка карточек с container-query типографикой.
import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'

import { useMediaQuery } from '@/hooks'
import {
  partners,
  SECTION_TITLE,
  GRID_MIN_CARD,
  GRID_GAP,
  GRID_MAX_WIDTH,
} from '@/content/partners'

const ENTRANCE_DURATION = 0.9
const ENTRANCE_EASE = [0.22, 1, 0.36, 1]
const ENTRANCE_Y = 40
const ENTRANCE_STAGGER = 0.1

// Пороги колонок для auto-fit minmax(437px,1fr): ≥1428px → 3 col, ≥960px → 2 col.
// Соответствуют CSS-сетке с учётом padding'а секции (px-8/px-10).
const COL_2_QUERY = '(min-width: 960px)'
const COL_3_QUERY = '(min-width: 1428px)'

/**
 * Карточка партнёра с hover-эффектом через Tailwind group-hover.
 * Использует container queries (cqw) для fluid-типографики внутри карточки.
 */
function PartnerCard({ partner }) {
  const { name, spec, category, city, year, url, logo, photo } = partner

  return (
    <a
      href={url || '#'}
      onClick={(e) => {
        if (!url) e.preventDefault()
      }}
      className="group block overflow-hidden rounded-xl bg-card p-4 shadow-[0_1px_4px_rgba(0,0,0,0.03)] transition-all duration-300 @container hover:bg-slateHover hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] sm:aspect-[437/288] lg:p-6"
    >
      <div
        className="grid h-full gap-5 lg:gap-6"
        style={{ gridTemplateColumns: '1fr clamp(140px, 40%, 175px)' }}
      >
        {/* Левая часть: текст + теги */}
        <div className="flex min-w-0 flex-col justify-between overflow-hidden">
          <div className="min-w-0 overflow-hidden">
            <h4 className="truncate text-[clamp(1.575rem,7.2cqw,2.025rem)] font-medium leading-tight tracking-wide text-slate transition-colors duration-300 group-hover:text-white">
              {name}
            </h4>
            <p className="mt-1.5 line-clamp-3 text-[clamp(0.89rem,4.15cqw,1.14rem)] leading-relaxed text-muted transition-colors duration-300 group-hover:text-white">
              {spec}
            </p>
          </div>

          <div className="mt-4 flex flex-col flex-wrap items-start gap-0.5">
            <span className="rounded-md bg-tagDate px-2 py-0 text-[clamp(12px,3.2cqw,14px)] font-medium text-navy transition-colors duration-300 group-hover:bg-white/90">
              {year}
            </span>
            <span className="rounded-md bg-red px-2 py-0 text-[clamp(12px,3.2cqw,14px)] font-medium text-white">
              {category}
            </span>
            <span className="rounded-md bg-navy px-2 py-0 text-[clamp(12px,3.2cqw,14px)] font-medium text-white">
              {city}
            </span>
          </div>
        </div>

        {/* Правая часть: фото + логотип */}
        <div className="flex min-w-0 flex-col gap-px overflow-hidden">
          <div className="flex-1 overflow-hidden rounded-lg">
            <img src={photo} alt={name} className="h-full w-full object-cover" />
          </div>
          <div
            className="flex items-center justify-center overflow-hidden rounded-lg bg-white"
            style={{ flex: '0 0 clamp(52px, 24%, 70px)' }}
          >
            <img
              src={logo}
              alt={`${name} logo`}
              className="max-h-full max-w-[70%] object-contain"
            />
          </div>
        </div>
      </div>
    </a>
  )
}

/**
 * Секция партнёров — адаптивная сетка карточек с container-query типографикой.
 */
export default function PartnersSection() {
  const shouldReduceMotion = useReducedMotion()
  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { once: true, amount: 0.15 })

  // Кол-во колонок derived из viewport — соответствует визуальной CSS auto-fit раскладке.
  const is2Cols = useMediaQuery(COL_2_QUERY, false)
  const is3Cols = useMediaQuery(COL_3_QUERY, false)
  const cols = is3Cols ? 3 : is2Cols ? 2 : 1

  const titleMotion = shouldReduceMotion
    ? { initial: false }
    : {
        initial: { opacity: 0, y: ENTRANCE_Y },
        animate: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: ENTRANCE_Y },
        transition: { duration: ENTRANCE_DURATION, ease: ENTRANCE_EASE },
      }

  return (
    <section ref={sectionRef} className="bg-tagDate px-4 py-16 md:px-8 md:py-20 lg:px-10 lg:py-24">
      <div className="mx-auto" style={{ maxWidth: GRID_MAX_WIDTH }}>
        <motion.p {...titleMotion} className="mb-8 text-2xl font-medium text-slateHover">
          {SECTION_TITLE}
        </motion.p>
        <div
          className="grid justify-center"
          style={{
            gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${GRID_MIN_CARD}px), 1fr))`,
            gap: GRID_GAP,
          }}
        >
          {partners.map((p, i) => {
            const rowIndex = Math.floor(i / cols)
            const cardMotion = shouldReduceMotion
              ? { initial: false }
              : {
                  initial: { opacity: 0, y: ENTRANCE_Y },
                  animate: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: ENTRANCE_Y },
                  transition: {
                    duration: ENTRANCE_DURATION,
                    delay: (rowIndex + 1) * ENTRANCE_STAGGER,
                    ease: ENTRANCE_EASE,
                  },
                }
            return (
              <motion.div key={i} {...cardMotion}>
                <PartnerCard partner={p} />
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
