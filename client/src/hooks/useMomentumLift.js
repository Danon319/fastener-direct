// src/hooks/useMomentumLift.js
//
// Инерция «догоняния» для обёртки со скроллом: блок отстаёт от скролла при движении,
// затем за ~500 мс мягко возвращается пружиной (перекритическое затухание, без отскока). Визуально:
//   - быстрый скролл вниз → обёртка «отстаёт» примерно на 100 px ниже базы → поднимается вверх
//   - быстрый скролл вверх → обёртка «отстаёт» примерно на 100 px выше базы → опускается вниз
// Только translateY — без сдвига по X, масштаба и поворота, чтобы вёрстка, скругление углов
// и тень не «плыли». Амплитуда жёстко ограничена диапазоном ±AMPLITUDE_PX.
//
// Настройка пружины: stiffness=83, damping=20, mass=1 → zeta ≈ 1,1 (слегка
// перекритическое затухание) и ~500 мс до ~99% установления. Без перелёта через целевое положение.
//
// При prefers-reduced-motion: амплитуда обнуляется (выходной диапазон [0, 0]),
// обёртка ведёт себя как жёсткая привязка к скроллу.

import {
  useScroll,
  useVelocity,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'motion/react'

const AMPLITUDE_PX = 100
const VELOCITY_CAP = 2500 // пикс/с — скорость скролла выше этого значения ограничивается

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
