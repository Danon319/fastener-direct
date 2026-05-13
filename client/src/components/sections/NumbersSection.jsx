import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
import PropTypes from 'prop-types'

import { useViewport, useCountUp } from '@/hooks'
import {
  COUNT_DURATION,
  LINE_DURATION,
  STAGGER_DELAY_S,
  STATS_ROW1,
  STATS_ROW2,
} from '@/content/numbers'

// Line starts late so it finishes at exactly the same instant as the count-up.
const LINE_START_DELAY = (COUNT_DURATION - LINE_DURATION) / 1000

/**
 * Одна статистическая ячейка: вертикальная линия + число (count-up) + подпись.
 *
 * @param {Object}  props
 * @param {number}  props.value        - Целевое число.
 * @param {string}  props.suffix       - Суффикс после числа (например «+», «ч», «лет»).
 * @param {string}  props.label        - Подпись под числом.
 * @param {number}  props.delay        - Задержка entrance-анимации (fade+rise) в секундах.
 * @param {boolean} props.inView       - Секция в viewport — все счётчики стартуют одновременно.
 */
function StatItem({ value, suffix, label, delay, inView }) {
  const [countStart, setCountStart] = useState(false)

  // All counters start simultaneously — no per-item stagger.
  useEffect(() => {
    if (!inView) return
    const timer = setTimeout(() => setCountStart(true), 0)
    return () => clearTimeout(timer)
  }, [inView])

  const num = useCountUp(value, COUNT_DURATION, countStart)
  const formatted = value >= 1000 ? num.toLocaleString('ru-RU') : num

  return (
    <div className="relative min-w-0 py-2 pl-3.5 md:py-3 md:pl-5 lg:py-4 lg:pl-6">
      {/* Vertical line — CSS transition for precise timing control.
          Starts at LINE_START_DELAY so it finishes together with the count-up. */}
      <span
        aria-hidden
        className="absolute bottom-0 left-0 top-0 w-px origin-top bg-white/15"
        style={{
          transform: inView ? 'scaleY(1)' : 'scaleY(0)',
          transition: `transform ${LINE_DURATION / 1000}s cubic-bezier(0.22, 1, 0.36, 1) ${LINE_START_DELAY}s`,
        }}
      />

      {/* Content — staggered fade + rise via motion */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 16 }}
        transition={{ duration: 0.7, ease: 'easeOut', delay: delay + 0.15 }}
      >
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
  delay: PropTypes.number.isRequired,
  inView: PropTypes.bool.isRequired,
}

/**
 * Секция статистики: 4 числа в 2 строки × 2 колонки на десктопе,
 * 1 колонка на мобиле. Вторая строка сдвинута вправо на десктопе.
 * Все 4 счётчика стартуют и завершаются одновременно при входе секции в viewport.
 */
export default function NumbersSection() {
  const { isTouch } = useViewport()
  const sectionRef = useRef(null)
  // Single observer on the section — all counters trigger at the same moment.
  const inView = useInView(sectionRef, { once: true, amount: isTouch ? 0.2 : 0.3 })

  return (
    <section ref={sectionRef} className="bg-slate px-16 py-16 font-sans lg:py-52">
      <div className="mx-auto w-full max-w-7xl">
        {/* Row 1 */}
        <div className="mb-6 grid grid-cols-1 gap-6 md:mb-12 md:grid-cols-2 md:gap-16 lg:mb-16 lg:gap-24">
          {STATS_ROW1.map((stat, i) => (
            <StatItem key={`r1-${i}`} {...stat} delay={i * STAGGER_DELAY_S} inView={inView} />
          ))}
        </div>

        {/* Row 2 — offset right on desktop */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-16 md:pl-16 lg:gap-24 lg:pl-32">
          {STATS_ROW2.map((stat, i) => (
            <StatItem key={`r2-${i}`} {...stat} delay={0.3 + i * STAGGER_DELAY_S} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  )
}
