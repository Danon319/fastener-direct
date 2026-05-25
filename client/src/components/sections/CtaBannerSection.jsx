import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'

import Button from '@/components/ui/Button'
import { CTA_BANNER } from '@/content/ctaBanner'

// Hotfix K: entrance — title + photo scale синхронно t=0, кнопка t=0.1s.
// Длиннее duration и мягче ease — текст «выплывает» снизу, фото плавно увеличивается.
const ENTRANCE_DURATION = 0.9
const ENTRANCE_EASE = [0.22, 1, 0.36, 1]
const ENTRANCE_Y = 40
const BUTTON_DELAY = 0.1

/**
 * CTA-баннер с фоновым фото, затемнением и кнопкой связи.
 */
export default function CtaBannerSection() {
  const shouldReduceMotion = useReducedMotion()
  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { once: true, amount: 0.3 })

  const imgMotion = shouldReduceMotion
    ? { initial: false }
    : {
        initial: { scale: 1.05 },
        animate: { scale: inView ? 1 : 1.05 },
        transition: { duration: ENTRANCE_DURATION, ease: ENTRANCE_EASE },
      }

  const titleMotion = shouldReduceMotion
    ? { initial: false }
    : {
        initial: { opacity: 0, y: ENTRANCE_Y },
        animate: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: ENTRANCE_Y },
        transition: { duration: ENTRANCE_DURATION, ease: ENTRANCE_EASE },
      }

  const buttonMotion = shouldReduceMotion
    ? { initial: false }
    : {
        initial: { opacity: 0, y: ENTRANCE_Y },
        animate: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: ENTRANCE_Y },
        transition: { duration: ENTRANCE_DURATION, delay: BUTTON_DELAY, ease: ENTRANCE_EASE },
      }

  return (
    <section
      ref={sectionRef}
      className="bg-tagDate px-4 py-16 md:px-8 md:py-20 lg:px-16 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="relative aspect-[2/3] overflow-hidden rounded-xl md:aspect-[2/1]">
          <motion.img
            {...imgMotion}
            src={CTA_BANNER.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/55" />

          <div className="relative flex h-full flex-col justify-start p-6 md:p-10 lg:p-14">
            <motion.h2
              {...titleMotion}
              className="max-w-md text-3xl font-medium text-white md:max-w-lg md:text-4xl lg:max-w-3xl lg:text-5xl"
            >
              {CTA_BANNER.title}
            </motion.h2>

            <motion.div {...buttonMotion} className="mt-6">
              <Button text={CTA_BANNER.buttonText} size="md" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
