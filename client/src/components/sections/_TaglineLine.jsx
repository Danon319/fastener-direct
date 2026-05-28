// Приватный компонент Hero — одна анимированная строка tagline.
// Управляется prop'ом phase снаружи (Hero держит state machine). Y/opacity — 750ms, blur — первые/последние 300ms.
import { motion, useReducedMotion } from 'motion/react'
import PropTypes from 'prop-types'

import { cn } from '@/utils/cn'

const EASE = [0.35, 0, 0.25, 1]
const Y_DURATION = 0.75
const BLUR_DURATION = 0.3
const BLUR_PEAK = '2px'
const Y_OFFSET = 25

/**
 * Одна строка tagline в Hero. Реагирует на внешнюю phase machine.
 *
 * @param {Object} props
 * @param {'mount'|'firstEnter'|'rest'|'exiting'|'preEnter'|'entering'} props.phase - Фаза анимации.
 * @param {string} props.text - Содержимое строки.
 * @param {string} props.colorClass - Tailwind-класс цвета (text-white | text-red).
 * @param {string} props.fontSizeClass - Tailwind-класс размера шрифта (responsive набор одной строкой).
 * @param {number} [props.lineDelayMs=0] - Задержка фазы для этой строки (stagger).
 * @param {number} [props.initialDelay=0] - Задержка фазы firstEnter (mount entrance координация).
 * @param {'left'|'right'} [props.align='left'] - Выравнивание текста.
 * @param {boolean} [props.allowWrap=false] - Если true — разрешить перенос.
 * @param {number} [props.marginTop=0] - Верхний отступ в px.
 */
function TaglineLine({
  phase,
  text,
  colorClass,
  fontSizeClass,
  lineDelayMs = 0,
  initialDelay = 0,
  align = 'left',
  allowWrap = false,
  marginTop = 0,
}) {
  const shouldReduceMotion = useReducedMotion()
  const lineDelay = lineDelayMs / 1000

  let target
  let transition

  // При prefers-reduced-motion — деградация до opacity-only, без y-drift и blur.
  switch (phase) {
    case 'mount':
      target = { y: 0, opacity: 0, filter: 'blur(0px)' }
      transition = { duration: 0 }
      break
    case 'firstEnter':
      target = { y: 0, opacity: 1, filter: 'blur(0px)' }
      // initialDelay координирует tagline с Hero entrance (Faste/Direct → tagline → HeroHeader).
      transition = {
        duration: shouldReduceMotion ? 0 : 0.7,
        delay: shouldReduceMotion ? 0 : initialDelay,
        ease: EASE,
      }
      break
    case 'rest':
      target = { y: 0, opacity: 1, filter: 'blur(0px)' }
      transition = { duration: 0 }
      break
    case 'exiting':
      target = shouldReduceMotion
        ? { y: 0, opacity: 0, filter: 'blur(0px)' }
        : { y: -Y_OFFSET, opacity: 0, filter: `blur(${BLUR_PEAK})` }
      transition = shouldReduceMotion
        ? { opacity: { duration: Y_DURATION, delay: lineDelay, ease: EASE } }
        : {
            y: { duration: Y_DURATION, delay: lineDelay, ease: EASE },
            opacity: { duration: Y_DURATION, delay: lineDelay, ease: EASE },
            // Blur срабатывает только на последних 300ms exit'а: дольше держим
            // чёткий текст, потом размываем под конец.
            filter: {
              duration: BLUR_DURATION,
              delay: lineDelay + (Y_DURATION - BLUR_DURATION),
              ease: EASE,
            },
          }
      break
    case 'preEnter':
      target = shouldReduceMotion
        ? { y: 0, opacity: 0, filter: 'blur(0px)' }
        : { y: Y_OFFSET, opacity: 0, filter: `blur(${BLUR_PEAK})` }
      transition = { duration: 0 }
      break
    case 'entering':
      target = { y: 0, opacity: 1, filter: 'blur(0px)' }
      transition = shouldReduceMotion
        ? { opacity: { duration: Y_DURATION, delay: lineDelay, ease: EASE } }
        : {
            y: { duration: Y_DURATION, delay: lineDelay, ease: EASE },
            opacity: { duration: Y_DURATION, delay: lineDelay, ease: EASE },
            // Blur снимается за первые 300ms entering — после этого текст чёткий.
            filter: { duration: BLUR_DURATION, delay: lineDelay, ease: EASE },
          }
      break
    default:
      target = { y: 0, opacity: 1, filter: 'blur(0px)' }
      transition = { duration: 0 }
  }

  return (
    <motion.div
      animate={target}
      transition={transition}
      style={{ marginTop }}
      className={cn(
        'font-sans font-medium leading-[1.1]',
        'will-change-[transform,opacity,filter]',
        align === 'right' ? 'text-right' : 'text-left',
        allowWrap ? 'whitespace-normal break-words' : 'whitespace-nowrap',
        colorClass,
        fontSizeClass
      )}
    >
      {text}
    </motion.div>
  )
}

TaglineLine.propTypes = {
  phase: PropTypes.oneOf(['mount', 'firstEnter', 'rest', 'exiting', 'preEnter', 'entering'])
    .isRequired,
  text: PropTypes.string.isRequired,
  colorClass: PropTypes.string.isRequired,
  fontSizeClass: PropTypes.string.isRequired,
  lineDelayMs: PropTypes.number,
  initialDelay: PropTypes.number,
  align: PropTypes.oneOf(['left', 'right']),
  allowWrap: PropTypes.bool,
  marginTop: PropTypes.number,
}

export default TaglineLine
