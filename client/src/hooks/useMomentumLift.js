// src/hooks/useMomentumLift.js
//
// Heavy follow-through for the scroll wrapper. The wrapped section lags
// behind scroll during motion, then settles back over ~500ms via a soft
// spring (overdamped, no bounce). Visually:
//   - fast scroll down -> wrapper hangs ~100px below base -> settles UP
//   - fast scroll up   -> wrapper hangs ~100px above base -> settles DOWN
// Only translateY -- no x/scale/rotate -- so layout, borderRadius, and
// shadow stay pixel-stable. Amplitude hard-clamped to +/-AMPLITUDE_PX.
//
// Spring tuning: stiffness=83, damping=20, mass=1 -> zeta ~= 1.1 (slightly
// overdamped) and ~500ms 99% settle. No overshoot.
//
// prefers-reduced-motion: amplitude collapses to 0 (output range [0, 0]),
// so the wrapper tracks scroll exactly.

import {
  useScroll,
  useVelocity,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'motion/react'

const AMPLITUDE_PX = 100
const VELOCITY_CAP = 2500 // px/s -- scroll speed beyond this is clamped

export function useMomentumLift() {
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)

  const smoothVelocity = useSpring(velocity, {
    stiffness: 83,
    damping: 20,
    mass: 1,
    restDelta: 0.001,
    restSpeed: 0.01,
  })

  const output = reduce ? [0, 0] : [-AMPLITUDE_PX, AMPLITUDE_PX]

  return useTransform(smoothVelocity, [-VELOCITY_CAP, VELOCITY_CAP], output, {
    clamp: true,
  })
}
