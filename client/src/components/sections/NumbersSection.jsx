import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import PropTypes from 'prop-types'

import { useViewport, useCountUp } from '@/hooks'
import { COUNT_DURATION, LINE_DURATION, STATS_ROW1, STATS_ROW2 } from '@/content/numbers'

// Линия стартует позже, чтобы закончиться в тот же момент что и счётчик.
const LINE_START_DELAY = (COUNT_DURATION - LINE_DURATION) / 1000

// Hotfix K.1b: попарный entrance — каждая визуальная строка (пара чисел) появляется
// независимо при попадании СВОЕЙ строки в viewport. Stagger между парами — естественный
// из позиции скролла, без явных задержек.
const ENTRANCE_DURATION = 0.9
const ENTRANCE_EASE = [0.22, 1, 0.36, 1]
const ENTRANCE_Y = 40

/**
 * Одна статистическая ячейка: вертикальная линия + число (count-up) + подпись.
 *
 * @param {Object}  props
 * @param {number}  props.value              - Целевое число.
 * @param {string}  props.suffix             - Суффикс после числа (например «+», «ч», «лет»).
 * @param {string}  props.label              - Подпись под числом.
 * @param {boolean} props.inView             - Пара (визуальная строка) в viewport — оба счётчика пары стартуют одновременно.
 * @param {boolean} props.shouldReduceMotion - Флаг сниженного движения.
 */
function StatItem({ value, suffix, label, inView, shouldReduceMotion }) {
  const [countStart, setCountStart] = useState(false)

  // Счётчики пары стартуют одновременно при попадании пары в viewport.
  useEffect(() => {
    if (!inView) return
    const timer = setTimeout(() => setCountStart(true), 0)
    return () => clearTimeout(timer)
  }, [inView])

  const num = useCountUp(value, COUNT_DURATION, countStart)
  const formatted = value >= 1000 ? num.toLocaleString('ru-RU') : num

  const contentMotion = shouldReduceMotion
    ? { initial: false }
    : {
        initial: { opacity: 0, y: ENTRANCE_Y },
        animate: { opacity: inView ? 1 : 0, y: inView ? 0 : ENTRANCE_Y },
        transition: { duration: ENTRANCE_DURATION, ease: ENTRANCE_EASE },
      }

  return (
    <div className="relative min-w-0 py-2 pl-3.5 md:py-3 md:pl-5 lg:py-4 lg:pl-6">
      {/* Вертикальная линия — CSS-transition для точного управления таймингом.
          Стартует с задержкой LINE_START_DELAY, чтобы закончиться вместе со счётчиком. */}
      <span
        aria-hidden
        className="absolute bottom-0 left-0 top-0 w-px origin-top bg-white/15"
        style={{
          transform: inView ? 'scaleY(1)' : 'scaleY(0)',
          transition: `transform ${LINE_DURATION / 1000}s cubic-bezier(0.22, 1, 0.36, 1) ${LINE_START_DELAY}s`,
        }}
      />

      {/* Содержимое — синхронный fade-up для всех чисел секции */}
      <motion.div {...contentMotion}>
        <div className="mb-2 whitespace-nowrap font-sans text-6xl font-normal leading-none tracking-tight text-white lg:text-9xl">
          {formatted}
          {suffix}
        </div>
        <div className="font-sans text-2xl font-normal leading-snug text-white">{label}</div>
      </motion.div>
    </div>
  )
}

StatItem.propTypes = {
  value: PropTypes.number.isRequired,
  suffix: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  inView: PropTypes.bool.isRequired,
  shouldReduceMotion: PropTypes.bool.isRequired,
}

/**
 * Секция статистики: 4 числа в 2 строки × 2 колонки на десктопе,
 * 1 колонка на мобиле. Вторая строка сдвинута вправо на десктопе.
 *
 * Hotfix K.1b: каждая визуальная строка (пара) имеет собственный useInView и
 * стартует независимо. Внутри пары оба счётчика стартуют и финишируют одновременно.
 */
export default function NumbersSection() {
  const { isTouch } = useViewport()
  const shouldReduceMotion = useReducedMotion()
  const row1Ref = useRef(null)
  const row2Ref = useRef(null)
  // Per-pair observers — каждая пара триггерит свой entrance и count-up независимо.
  const viewportOptions = { once: true, amount: isTouch ? 0.2 : 0.8 }
  const row1InView = useInView(row1Ref, viewportOptions)
  const row2InView = useInView(row2Ref, viewportOptions)

  return (
    <section className="bg-slate px-16 py-16 font-sans lg:py-52">
      <div className="mx-auto w-full max-w-7xl">
        {/* Строка 1 — пара 1 */}
        <div
          ref={row1Ref}
          className="mb-6 grid grid-cols-1 gap-6 md:mb-12 md:grid-cols-2 md:gap-16 lg:mb-16 lg:gap-24"
        >
          {STATS_ROW1.map((stat, i) => (
            <StatItem
              key={`r1-${i}`}
              {...stat}
              inView={row1InView}
              shouldReduceMotion={shouldReduceMotion}
            />
          ))}
        </div>

        {/* Строка 2 — пара 2, смещена вправо на десктопе */}
        <div
          ref={row2Ref}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-16 md:pl-16 lg:gap-24 lg:pl-32"
        >
          {STATS_ROW2.map((stat, i) => (
            <StatItem
              key={`r2-${i}`}
              {...stat}
              inView={row2InView}
              shouldReduceMotion={shouldReduceMotion}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
