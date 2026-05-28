// Секция «Наши ценности». Десктоп: scroll-driven diagonal анимация карточек + перекраска заголовка. Мобильный: стопка.
import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'

import Button from '@/components/ui/Button'
import { GridLines } from '@/components/ui'
import { useBreakpoint } from '@/hooks'
import {
  LABEL,
  HEADING,
  BUTTON_TEXT,
  CARDS,
  ANIMATION_DELTA_X_VW,
  ANIMATION_DELTA_Y_PX,
  SCROLL_SPACER_HEIGHT_PX,
  SECTION_TAIL_HEIGHT_PX,
} from '@/content/ourValues'

const ENTRANCE_DURATION = 0.9
const ENTRANCE_EASE = [0.22, 1, 0.36, 1]
const ENTRANCE_Y = 40
const ENTRANCE_STAGGER = 0.1

function useEntranceProps() {
  const shouldReduceMotion = useReducedMotion()
  return (index) => {
    if (shouldReduceMotion) {
      return { initial: false }
    }
    return {
      initial: { opacity: 0, y: ENTRANCE_Y },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, amount: 0.3 },
      transition: {
        duration: ENTRANCE_DURATION,
        delay: index * ENTRANCE_STAGGER,
        ease: ENTRANCE_EASE,
      },
    }
  }
}

function useViewportWidth() {
  const [width, setWidth] = useState(() =>
    typeof window === 'undefined' ? 1920 : window.innerWidth
  )
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return width
}

function ValueCard({ title, description, isDesktop }) {
  return (
    <article
      className="flex shrink-0 flex-col justify-between rounded-2xl bg-white font-sans"
      style={{
        padding: '32px 24px',
        width: isDesktop ? '22vw' : '100%',
        minHeight: isDesktop ? '16rem' : 'auto',
      }}
    >
      <h3
        className="font-medium leading-none text-red"
        style={{ fontSize: isDesktop ? '3rem' : '2rem' }}
      >
        {title}
      </h3>
      <p
        className="font-medium leading-snug text-navy"
        style={{ marginTop: isDesktop ? '96px' : '48px' }}
      >
        {description}
      </p>
    </article>
  )
}

// Один <motion.span> на слово с интерполяцией цвета по scroll-progress.
// useTransform вызывается всегда (правила хуков); при isStatic — статичный <span>.
function ScrollColorWord({ word, index, total, scrollYProgress, isStatic, isLast }) {
  const color = useTransform(
    scrollYProgress,
    [index / total, (index + 1) / total],
    ['#ffffff', '#2E3F51']
  )
  const suffix = isLast ? '' : ' '
  if (isStatic) {
    return (
      <span style={{ color: '#2E3F51' }}>
        {word}
        {suffix}
      </span>
    )
  }
  return (
    <motion.span style={{ color }}>
      {word}
      {suffix}
    </motion.span>
  )
}

function TopBlockDesktop() {
  const entrance = useEntranceProps()
  const shouldReduceMotion = useReducedMotion()
  const headingRef = useRef(null)
  // Зона анимации: start 0.90 — заголовок входит снизу, end 0.6 — ещё виден.
  // Перекраска охватывает всё время видимости заголовка в viewport.
  const { scrollYProgress } = useScroll({
    target: headingRef,
    offset: ['start 0.90', 'end 0.6'],
  })
  const words = HEADING.split(' ')

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(15, minmax(0, 1fr))',
        columnGap: '15px',
      }}
    >
      <motion.p
        {...entrance(0)}
        className="text-2xl font-medium leading-none text-slateHover"
        style={{ gridColumn: '1 / span 3' }}
      >
        {LABEL}
      </motion.p>
      <div
        className="flex flex-col"
        // -0.52vw — slope «отрицательного» сдвига колонки заголовка, чтобы текст оптически
        // выравнивался с маркой по референсу Atout (карточки уезжают левее на широких экранах).
        style={{ gridColumn: '7 / 16', marginLeft: 'clamp(-12px, -0.25rem + -0.52vw, -20px)' }}
      >
        <h2
          ref={headingRef}
          className="text-[64px] font-medium leading-[1.1] xl:text-[76px] 2xl:text-[88px]"
          // width 890px переопределяет ограничение grid-колонки (9/15 ≈ 556–768px).
          // marginLeft: -50px — сдвиг влево; на 1440px+ помещается с запасом.
          style={{ width: '890px', marginLeft: '-50px' }}
        >
          {words.map((word, i) => (
            <ScrollColorWord
              key={`${word}-${i}`}
              word={word}
              index={i}
              total={words.length}
              scrollYProgress={scrollYProgress}
              isStatic={shouldReduceMotion}
              isLast={i === words.length - 1}
            />
          ))}
        </h2>
        <motion.div {...entrance(2)} className="mt-12">
          <Button text={BUTTON_TEXT} to="/about" size="lg" />
        </motion.div>
      </div>
    </div>
  )
}

function TopBlockMobile() {
  const entrance = useEntranceProps()
  return (
    <div className="flex flex-col gap-6 pl-2">
      <motion.p {...entrance(0)} className="text-xl font-medium leading-tight text-slateHover">
        {LABEL}
      </motion.p>
      <h2 className="text-[36px] font-medium leading-[1.1] text-slate md:text-[42px]">{HEADING}</h2>
      <motion.div {...entrance(2)} className="mt-6">
        <Button text={BUTTON_TEXT} to="/about" />
      </motion.div>
    </div>
  )
}

function MobileCardsStack() {
  const shouldReduceMotion = useReducedMotion()
  return (
    <div className="flex flex-col gap-6 px-6">
      {CARDS.map((card, i) => (
        <motion.div
          key={card.id}
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.6,
            ease: 'easeOut',
            // 0.05с — шаг stagger между соседними карточками; убираем при reduced-motion.
            delay: shouldReduceMotion ? 0 : i * 0.05,
          }}
        >
          <ValueCard title={card.title} description={card.description} isDesktop={false} />
        </motion.div>
      ))}
    </div>
  )
}

function DesktopCardsAnimated() {
  const animationZoneRef = useRef(null)
  const viewportWidth = useViewportWidth()
  const shouldReduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: animationZoneRef,
    offset: ['start 50%', 'end 50%'],
  })

  const deltaX = (viewportWidth * ANIMATION_DELTA_X_VW) / 100
  const x = useTransform(scrollYProgress, [0, 1], [0, deltaX])
  const y = useTransform(scrollYProgress, [0, 1], [0, ANIMATION_DELTA_Y_PX])

  // При reduced-motion отключаем scroll-driven диагональ — карточки сразу в финальном статичном ряду.
  const motionStyle = shouldReduceMotion
    ? { display: 'flex', gap: '1px', paddingLeft: '22vw' }
    : { display: 'flex', gap: '1px', paddingLeft: '22vw', x, y, willChange: 'transform' }

  return (
    <>
      <div ref={animationZoneRef} className="relative">
        <motion.div style={motionStyle}>
          {CARDS.map((card) => (
            <ValueCard key={card.id} title={card.title} description={card.description} isDesktop />
          ))}
        </motion.div>
        <div aria-hidden="true" style={{ height: `${SCROLL_SPACER_HEIGHT_PX}px` }} />
      </div>
      <div aria-hidden="true" style={{ height: `${SECTION_TAIL_HEIGHT_PX}px` }} />
    </>
  )
}

function CardsRow({ isDesktop }) {
  if (!isDesktop) return <MobileCardsStack />
  return <DesktopCardsAnimated />
}

/**
 * Секция «Наши ценности» с 5 карточками.
 * Десктоп: диагональная scroll-driven анимация карточек.
 * Мобильный: стопкой с fade-in.
 */
export default function OurValuesSection() {
  const isDesktop = useBreakpoint('lg', true)

  return (
    <section
      aria-label="Наши ценности"
      className="relative overflow-hidden rounded-t-2xl bg-tagDate font-sans"
      style={{ padding: isDesktop ? '96px 0 0 0' : '64px 0 64px 0' }}
    >
      {isDesktop && <GridLines columns={15} />}

      <div
        className="relative z-10 mx-auto max-w-7xl"
        style={{ padding: isDesktop ? '0 48px' : '0 24px' }}
      >
        {isDesktop ? <TopBlockDesktop /> : <TopBlockMobile />}
      </div>

      <div aria-hidden="true" style={{ height: isDesktop ? '148px' : '96px' }} />

      <div className="relative z-10">
        <CardsRow isDesktop={isDesktop} />
      </div>
    </section>
  )
}
