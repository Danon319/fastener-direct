import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'motion/react'

import Button from '@/components/ui/Button'
import {
  LABEL,
  HEADING,
  BUTTON_TEXT,
  CARDS,
  ANIMATION_DELTA_X_VW,
  ANIMATION_DELTA_Y_PX,
  SCROLL_SPACER_HEIGHT_PX,
  SECTION_TAIL_HEIGHT_PX,
  SPRING_CONFIG,
} from '@/content/ourValues'

const GRID_LINE_COLOR = '#d1d1d1'

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined') return true
    return window.matchMedia('(min-width: 1024px)').matches
  })
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const handler = (e) => setIsDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isDesktop
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

function GridOverlay() {
  const lines = []
  for (let i = 1; i < 15; i++) {
    lines.push(
      <div
        key={i}
        className="absolute top-0 bottom-0"
        style={{
          left: `${(i / 15) * 100}%`,
          width: '1px',
          backgroundColor: GRID_LINE_COLOR,
        }}
      />
    )
  }
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {lines}
    </div>
  )
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

function TopBlockDesktop() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(15, minmax(0, 1fr))',
        columnGap: '15px',
      }}
    >
      <p
        className="text-2xl font-medium leading-none text-slateHover"
        style={{ gridColumn: '1 / span 3' }}
      >
        {LABEL}
      </p>
      <div
        className="flex flex-col"
        style={{ gridColumn: '7 / 16', marginLeft: 'clamp(-12px, -0.25rem + -0.52vw, -20px)' }}
      >
        <h2
          className="font-medium leading-tight text-slate"
          style={{
            fontSize: 'clamp(3rem, 1.43rem + 2.46vw, 4.5rem)',
            maxWidth: 'clamp(560px, 26.79rem + 13.39vw, 800px)',
          }}
        >
          {HEADING}
        </h2>
        <div className="mt-12">
          <Button text={BUTTON_TEXT} to="/about" />
        </div>
      </div>
    </div>
  )
}

function TopBlockMobile() {
  return (
    <div className="flex flex-col gap-6 pl-2">
      <p className="text-xl font-medium leading-tight text-slateHover">
        {LABEL}
      </p>
      <h2
        className="font-medium leading-tight text-slate"
        style={{ fontSize: 'clamp(2rem, 8vw, 3.5rem)' }}
      >
        {HEADING}
      </h2>
      <div className="mt-6">
        <Button text={BUTTON_TEXT} to="/about" />
      </div>
    </div>
  )
}

function MobileCardsStack() {
  return (
    <div className="flex flex-col gap-6 px-6">
      {CARDS.map((card, i) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.05 }}
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

  const { scrollYProgress } = useScroll({
    target: animationZoneRef,
    offset: ['start 50%', 'end end'],
  })

  const deltaX = (viewportWidth * ANIMATION_DELTA_X_VW) / 100
  const rawX = useTransform(scrollYProgress, [0, 1], [0, deltaX])
  const rawY = useTransform(scrollYProgress, [0, 1], [0, ANIMATION_DELTA_Y_PX])
  const x = useSpring(rawX, SPRING_CONFIG)
  const y = useSpring(rawY, SPRING_CONFIG)

  return (
    <>
      <div ref={animationZoneRef} className="relative">
        <motion.div
          style={{
            display: 'flex',
            gap: '1px',
            paddingLeft: '22vw',
            x,
            y,
            willChange: 'transform',
          }}
        >
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
 * Desktop: scroll-driven diagonal card animation.
 * Mobile: stacked cards with fade-in.
 */
export default function OurValuesSection() {
  const isDesktop = useIsDesktop()

  return (
    <section
      aria-label="Our values"
      className="relative overflow-hidden rounded-t-2xl bg-tagDate font-sans"
      style={{ padding: isDesktop ? '96px 0 0 0' : '64px 0 64px 0' }}
    >
      {isDesktop && <GridOverlay />}

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
