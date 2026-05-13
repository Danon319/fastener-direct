import { useState, useRef, useEffect } from 'react'
import { motion, useInView, useMotionValue, useMotionValueEvent, animate } from 'motion/react'

import {
  TITLE,
  sectors,
  OR,
  R_STROKE,
  STROKE_WIDTH,
  CX,
  CY,
  SIZE,
  DECO_RINGS,
  INTRO_DURATION,
  RING_STAGGER,
  POLOS_WIDTH,
  OMEGA_SKATE,
  OMEGA_GROW,
  OVERLAP,
  RING_COLOR,
} from '@/content/fastenerDiagram'

/* ─── Precomputed segment angles ─── */

const segAngles = (() => {
  const result = []
  let cum = 0
  for (const s of sectors) {
    const len = (s.pct / 100) * 360
    result.push({ near: cum, far: cum + len, length: len })
    cum += len
  }
  return result
})()

/* ─── Precomputed timings ─── */

const segTimings = (() => {
  const result = []
  let t = INTRO_DURATION
  for (let i = 0; i < sectors.length; i++) {
    const { near, far } = segAngles[i]
    const phase1Duration = near / OMEGA_SKATE
    const phase2Duration = (far - near) / OMEGA_GROW
    result.push({
      startAt: t,
      phase1Duration,
      phase2Duration,
      totalEnd: t + phase1Duration + phase2Duration,
    })
    const refPhase = phase1Duration > 0 ? phase1Duration : phase2Duration
    t += refPhase * OVERLAP
  }
  return result
})()

const TOTAL_DURATION = Math.max(...segTimings.map((s) => s.totalEnd))

/* ─── Animation math ─── */

function easeOut(t) {
  return 1 - Math.pow(1 - t, 3)
}

function computeSegmentAt(t, i) {
  const timing = segTimings[i]
  const { near, far } = segAngles[i]

  if (t < timing.startAt) {
    return { lead: 0, trail: 0, visible: false }
  }

  const localT = t - timing.startAt

  if (timing.phase1Duration > 0 && localT < timing.phase1Duration) {
    const p = localT / timing.phase1Duration
    const lead = p * near
    const trail = Math.max(0, lead - POLOS_WIDTH)
    return { lead, trail, visible: true }
  }

  const phase2T = localT - timing.phase1Duration
  if (phase2T >= timing.phase2Duration) {
    return { lead: far, trail: near, visible: true }
  }
  const p = phase2T / timing.phase2Duration
  const eased = easeOut(p)
  const lead = near + eased * (far - near)
  return { lead, trail: near, visible: true }
}

/* ─── SVG arc path ─── */

function arcPath(trailDeg, leadDeg) {
  const DEG = Math.PI / 180
  const sa = -Math.PI / 2 + trailDeg * DEG
  const ea = -Math.PI / 2 + leadDeg * DEG
  const sx = CX + R_STROKE * Math.cos(sa)
  const sy = CY + R_STROKE * Math.sin(sa)
  const ex = CX + R_STROKE * Math.cos(ea)
  const ey = CY + R_STROKE * Math.sin(ea)
  const large = leadDeg - trailDeg > 180 ? 1 : 0
  return `M ${sx} ${sy} A ${R_STROKE} ${R_STROKE} 0 ${large} 1 ${ex} ${ey}`
}

/* ─── Label position ─── */

function computeLabelPos(i) {
  const { near, far } = segAngles[i]
  const midDeg = (near + far) / 2
  const ma = -Math.PI / 2 + (midDeg * Math.PI) / 180
  const lx = CX + OR * Math.cos(ma)
  const ly = CY + OR * Math.sin(ma)
  const isRight = Math.cos(ma) >= 0
  return { lx, ly, isRight }
}

/* ─── Breakpoint hook (local to this file) ─── */

function useBreakpoint() {
  const getBp = () => {
    if (typeof window === 'undefined') return 'xl'
    const w = window.innerWidth
    if (w >= 1440) return 'xl'
    if (w >= 1024) return 'lg'
    if (w >= 768) return 'md'
    return 'sm'
  }

  const [bp, setBp] = useState(getBp)

  useEffect(() => {
    const queries = [
      window.matchMedia('(min-width: 1440px)'),
      window.matchMedia('(min-width: 1024px)'),
      window.matchMedia('(min-width: 768px)'),
    ]
    const update = () => setBp(getBp())
    queries.forEach((q) => q.addEventListener('change', update))
    return () => queries.forEach((q) => q.removeEventListener('change', update))
  }, [])

  return bp
}

/* ─── Subcomponents ─── */

function SegmentPath({ trail, lead, color, visible }) {
  if (!visible || lead - trail < 0.1) return null
  return (
    <path
      d={arcPath(trail, lead)}
      stroke={color}
      strokeWidth={STROKE_WIDTH}
      fill="none"
      strokeLinecap="butt"
    />
  )
}

function DecoRing({ r, delay, inView }) {
  const d = r * 2
  const pct = (d / SIZE) * 100
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
      transition={{ delay, duration: 0.8, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        width: pct + '%',
        height: pct + '%',
        top: '50%',
        left: '50%',
        marginLeft: `-${pct / 2}%`,
        marginTop: `-${pct / 2}%`,
        borderRadius: '50%',
        border: `1px solid ${RING_COLOR}`,
        pointerEvents: 'none',
      }}
    />
  )
}

function DonutLabel({ i, inView }) {
  const { lx, ly, isRight } = computeLabelPos(i)
  const { label, pct, color } = sectors[i]
  const xPct = (lx / SIZE) * 100
  const yPct = (ly / SIZE) * 100
  const posStyle = isRight
    ? { left: xPct + '%', top: yPct + '%' }
    : { right: 100 - xPct + '%', top: yPct + '%' }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{
        delay: segTimings[i].startAt,
        duration: 0.4,
        ease: 'easeOut',
      }}
      style={{
        position: 'absolute',
        ...posStyle,
        transform: 'translateY(-100%)',
        borderBottom: `1px solid ${color}`,
        paddingBottom: 8,
        paddingLeft: isRight ? (i === 2 ? 85 : 20) : 0,
        paddingRight: isRight ? 0 : 20,
        whiteSpace: 'nowrap',
        textAlign: isRight ? 'left' : 'right',
        lineHeight: 1,
        pointerEvents: 'none',
      }}
    >
      <span className="text-2xl font-medium text-white">{label}</span>
      <span
        className="text-lg text-white/45"
        style={{
          marginLeft: isRight ? 8 : 0,
          paddingLeft: isRight ? 0 : 8,
        }}
      >
        {pct} %
      </span>
    </motion.div>
  )
}

function LegendItem({ i, inView }) {
  const { label, pct, color } = sectors[i]
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{
        delay: segTimings[i].startAt,
        duration: 0.4,
        ease: 'easeOut',
      }}
      style={{
        borderBottom: `1px solid ${color}`,
        paddingBottom: 8,
        lineHeight: 1.1,
        whiteSpace: 'nowrap',
      }}
    >
      <span className="text-3xl font-medium text-white">{label}</span>
      <span className="ml-2 text-xl text-white/45">{pct} %</span>
    </motion.div>
  )
}

function Legend({ inView }) {
  return (
    <div className="mt-10 flex w-full max-w-4xl flex-wrap justify-center gap-x-7 gap-y-5 font-sans">
      {sectors.map((_, i) => (
        <LegendItem key={i} i={i} inView={inView} />
      ))}
    </div>
  )
}

function DonutChart({ inView, bp }) {
  const progress = useMotionValue(0)
  const [progressTime, setProgressTime] = useState(0)

  useMotionValueEvent(progress, 'change', (latest) => {
    setProgressTime(latest)
  })

  useEffect(() => {
    if (!inView) return
    const controls = animate(progress, TOTAL_DURATION, {
      duration: TOTAL_DURATION,
      ease: 'linear',
    })
    return () => controls.stop()
  }, [inView, progress])

  const maxWidth =
    bp === 'xl' ? 900 : bp === 'lg' ? 720 : bp === 'md' ? 680 : 'clamp(320px, 90vw, 520px)'

  const marginStyle = bp === 'xl' || bp === 'lg' ? { marginLeft: 'auto' } : { margin: '0 auto' }

  const showFlagLabels = bp !== 'sm'

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth,
        aspectRatio: '1 / 1',
        overflow: 'visible',
        ...marginStyle,
      }}
    >
      {DECO_RINGS.map((ring, i) => (
        <DecoRing key={i} r={ring.r} delay={i * RING_STAGGER} inView={inView} />
      ))}

      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        width="100%"
        height="100%"
        style={{
          display: 'block',
          position: 'relative',
          zIndex: 1,
          overflow: 'visible',
        }}
      >
        {sectors.map((s, i) => {
          const state = computeSegmentAt(progressTime, i)
          return (
            <SegmentPath
              key={i}
              trail={state.trail}
              lead={state.lead}
              visible={state.visible}
              color={s.color}
            />
          )
        })}
      </svg>

      {showFlagLabels && (
        <div className="pointer-events-none absolute inset-0 z-[2]">
          {sectors.map((_, i) => (
            <DonutLabel key={i} i={i} inView={inView} />
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Main section ─── */

/**
 * Секция с donut-диаграммой клиентов Fastener Direct.
 * Анимированные сегменты (skate+grow), декоративные кольца, лейблы на desktop, легенда на mobile.
 */
export default function FastenerDiagramSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })
  const bp = useBreakpoint()

  const isVertical = bp === 'md' || bp === 'sm'

  const titleInitial = isVertical ? { opacity: 0, y: 20 } : { opacity: 0, x: -20 }
  const titleAnimate = inView ? { opacity: 1, x: 0, y: 0 } : titleInitial

  return (
    <section
      ref={ref}
      className="overflow-hidden bg-navy px-5 py-14 font-sans md:px-6 md:py-[72px] lg:px-8 lg:py-20 xl:px-10 xl:py-24"
    >
      <div
        className={
          isVertical
            ? 'mx-auto flex max-w-[1200px] flex-col items-center gap-8 md:gap-12'
            : 'mx-auto grid max-w-[1200px] grid-cols-2 items-center gap-12 xl:gap-16'
        }
      >
        <motion.p
          initial={titleInitial}
          animate={titleAnimate}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={
            'relative z-10 text-xl font-medium leading-normal text-red md:text-2xl lg:text-xl xl:text-2xl' +
            (isVertical ? ' text-center' : ' text-left')
          }
        >
          {TITLE}
        </motion.p>

        <div
          className={
            isVertical
              ? 'flex w-full flex-col items-center overflow-visible'
              : 'w-full overflow-visible'
          }
        >
          <DonutChart inView={inView} bp={bp} />
          {bp === 'sm' && <Legend inView={inView} />}
        </div>
      </div>
    </section>
  )
}
