// src/components/sections/Hero.jsx
//
// Hero-секция с видео-фоном, дарк-overlay'ем, прозрачным HeroHeader'ом
// и большим заголовком «Faste / Direct» с анимированным tagline.
//
// Phase 4A: только визуал и tagline-машина. Никакого параллакса/momentum
// lift / fixed-positioning — всё это Phase 4B.
//
// Tagline-машина живёт здесь (Hero — оркестратор фаз), сами анимированные
// строки — в _TaglineLine. См. spec в Phase 4A prompt.
//
// Layout switch ≥1024px: на desktop "Faste" и tagline-блок «Direct»
// располагаются в две строки (Faste — правый край левой половины,
// [tagline | Direct] — вторая), на стacked (<1024px) — три отдельных
// строки. Один смонтированный _TaglineLine в каждой роли (избегаем
// дублирования motion-divs).
import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

import { useBreakpoint } from '@/hooks'
import { BIG_LEFT, BIG_RIGHT, TAGLINES } from '@/content/hero'

import TaglineLine from './_TaglineLine'

const REST_MS = 5000
const EXIT_MS = 750
const ENTER_MS = 750
const SWAP_GAP_MS = 10
const LINE_STAGGER_MS = 150
const FIRST_FADE_MS = 700

// Hotfix K: координированный entrance — Faste/Direct в t=0, tagline в t=100ms.
// Длиннее duration и мягче ease — элементы «выплывают» из-под линии, без рывка.
const ENTRANCE_DURATION = 0.9
const ENTRANCE_EASE = [0.22, 1, 0.36, 1]
const ENTRANCE_Y = 40
const TAGLINE_ENTRANCE_DELAY_S = 0.1

/**
 * Hero-секция главной страницы.
 *
 * Видео-фон + dark overlay + прозрачный HeroHeader + крупный двухстрочный
 * заголовок «Faste / Direct» + ротирующийся tagline (4 пары × ~5s).
 */
export default function Hero() {
  const isDesktop = useBreakpoint('lg', false)
  const shouldReduceMotion = useReducedMotion()

  const [heroVisible, setHeroVisible] = useState(true)
  const [idx, setIdx] = useState(0)
  const [phase, setPhase] = useState('mount')

  const videoRef = useRef(null)
  const timersRef = useRef([])
  // Self-referencing recursion в useCallback ловит "Cannot access ... before
  // initialization" — держим актуальный runCycle в ref'е и зовём через
  // runCycleRef.current?.() из вложенных setTimeout.
  const runCycleRef = useRef(null)

  const pushTimer = useCallback((id) => {
    timersRef.current.push(id)
  }, [])

  const clearTimers = useCallback(() => {
    for (const id of timersRef.current) clearTimeout(id)
    timersRef.current = []
  }, [])

  const runCycle = useCallback(() => {
    setPhase('exiting')
    pushTimer(
      setTimeout(() => {
        setIdx((i) => (i + 1) % TAGLINES.length)
        setPhase('preEnter')
        pushTimer(
          setTimeout(() => {
            setPhase('entering')
            pushTimer(
              setTimeout(() => {
                setPhase('rest')
                pushTimer(
                  setTimeout(() => {
                    runCycleRef.current?.()
                  }, REST_MS)
                )
              }, ENTER_MS + LINE_STAGGER_MS)
            )
          }, SWAP_GAP_MS)
        )
      }, EXIT_MS + LINE_STAGGER_MS)
    )
  }, [pushTimer])

  // Поддерживаем актуальную ссылку на runCycle для рекурсии через ref.
  useEffect(() => {
    runCycleRef.current = runCycle
  }, [runCycle])

  // Запуск при монтировании: firstEnter → rest → первый цикл ротации.
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setPhase('firstEnter')
      pushTimer(
        setTimeout(() => {
          setPhase('rest')
          pushTimer(
            setTimeout(() => {
              runCycleRef.current?.()
            }, REST_MS)
          )
        }, FIRST_FADE_MS)
      )
    })
    return () => {
      cancelAnimationFrame(raf)
      clearTimers()
    }
  }, [pushTimer, clearTimers])

  // Пауза/возобновление при visibility-change. Уровень 2: ротация просто
  // приостанавливается и возобновляется через REST_MS на возврате.
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        videoRef.current?.pause()
        clearTimers()
      } else {
        videoRef.current?.play().catch(() => {})
        pushTimer(
          setTimeout(() => {
            runCycleRef.current?.()
          }, REST_MS)
        )
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [pushTimer, clearTimers])

  // Скрываем Hero после прокрутки за высоту viewport, чтобы секция
  // не проглядывала сквозь Footer.
  useEffect(() => {
    const onScroll = () => {
      setHeroVisible(window.scrollY < window.innerHeight)
    }
    // Проверяем сразу на случай если страница открыта в середине скролла.
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const [whiteText, redText] = TAGLINES[idx]

  // Tailwind-классы для большого текста — общие для desktop и stacked.
  // Размер у desktop хардкоден (19.76vw), у stacked — clamp через arbitrary
  // [min(...,...)] чтобы в landscape mobile текст не уезжал за экран.
  const bigBaseClass = 'inline-block font-sans font-medium leading-[0.82] text-white/50'
  const bigSizeDesktop = 'text-[19.76vw] tracking-[8px]'
  const bigSizeStacked =
    'text-[min(19.76vw,16vh)] tracking-[2px] sm:tracking-[4px] md:tracking-[6px]'

  const taglineFontDesktop = 'text-5xl xl:text-6xl'
  const taglineFontStacked = 'text-lg sm:text-2xl md:text-4xl'

  // Mount-based entrance: Faste/Direct в t=0, tagline стартует через initialDelay внутри firstEnter.
  const bigEntranceInitial = shouldReduceMotion
    ? { opacity: 1, y: 0 }
    : { opacity: 0, y: ENTRANCE_Y }
  const bigEntranceAnimate = { opacity: 1, y: 0 }
  const bigEntranceTransition = {
    duration: shouldReduceMotion ? 0 : ENTRANCE_DURATION,
    ease: ENTRANCE_EASE,
  }
  const taglineInitialDelay = shouldReduceMotion ? 0 : TAGLINE_ENTRANCE_DELAY_S

  return (
    <section
      className="fixed left-0 right-0 top-0 z-hero h-screen w-full overflow-hidden"
      style={{ visibility: heroVisible ? 'visible' : 'hidden' }}
    >
      <video
        ref={videoRef}
        src="/video/factory_bg.mp4"
        poster="/video/factory_bg-page.png"
        autoPlay
        muted
        loop
        playsInline
        onEnded={(e) => e.target.play()}
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 z-[1] bg-black/30" />

      <div className="absolute inset-0 z-[2] flex flex-col justify-end gap-2 px-3 pb-24 md:px-8 lg:px-12 xl:px-16">
        {isDesktop ? (
          <>
            {/* Row 1: «Faste» — правый край левой половины. */}
            <div className="w-1/2 text-right">
              <motion.span
                initial={bigEntranceInitial}
                animate={bigEntranceAnimate}
                transition={bigEntranceTransition}
                className={`${bigBaseClass} ${bigSizeDesktop}`}
              >
                {BIG_LEFT}
              </motion.span>
            </div>

            {/* Строка 2: [tagline 50%] [Direct flex-1]. */}
            <div className="flex w-full items-end">
              <div className="flex w-1/2 justify-end pb-1.5 pr-5">
                <div className="text-right">
                  <TaglineLine
                    phase={phase}
                    text={whiteText}
                    colorClass="text-white"
                    fontSizeClass={taglineFontDesktop}
                    lineDelayMs={0}
                    initialDelay={taglineInitialDelay}
                    align="right"
                  />
                  <TaglineLine
                    phase={phase}
                    text={redText}
                    colorClass="text-red"
                    fontSizeClass={taglineFontDesktop}
                    lineDelayMs={LINE_STAGGER_MS}
                    initialDelay={taglineInitialDelay}
                    align="right"
                    marginTop={10}
                  />
                </div>
              </div>
              <div className="flex-1">
                <motion.span
                  initial={bigEntranceInitial}
                  animate={bigEntranceAnimate}
                  transition={bigEntranceTransition}
                  className={`${bigBaseClass} ${bigSizeDesktop}`}
                >
                  {BIG_RIGHT}
                </motion.span>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Row 1: «Faste» — на всю ширину, по левому краю. */}
            <div className="w-full text-left">
              <motion.span
                initial={bigEntranceInitial}
                animate={bigEntranceAnimate}
                transition={bigEntranceTransition}
                className={`${bigBaseClass} ${bigSizeStacked}`}
              >
                {BIG_LEFT}
              </motion.span>
            </div>

            {/* Row 2: «Direct» — на всю ширину, по правому краю. */}
            <div className="w-full text-right">
              <motion.span
                initial={bigEntranceInitial}
                animate={bigEntranceAnimate}
                transition={bigEntranceTransition}
                className={`${bigBaseClass} ${bigSizeStacked}`}
              >
                {BIG_RIGHT}
              </motion.span>
            </div>

            {/* Row 3: tagline — на всю ширину, по левому краю, с верхним отступом. */}
            <div className="mt-5 w-full text-left sm:mt-10">
              <TaglineLine
                phase={phase}
                text={whiteText}
                colorClass="text-white"
                fontSizeClass={taglineFontStacked}
                lineDelayMs={0}
                initialDelay={taglineInitialDelay}
                align="left"
                allowWrap
              />
              <TaglineLine
                phase={phase}
                text={redText}
                colorClass="text-red"
                fontSizeClass={taglineFontStacked}
                lineDelayMs={LINE_STAGGER_MS}
                initialDelay={taglineInitialDelay}
                align="left"
                allowWrap
                marginTop={10}
              />
            </div>
          </>
        )}
      </div>
    </section>
  )
}
