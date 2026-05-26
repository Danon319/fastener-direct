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
      className="bg-tagDate px-4 py-16 md:px-8 md:py-20 lg:px-10 lg:py-24"
    >
      <div className="mx-auto max-w-[1347px]">
        <div className="relative overflow-hidden rounded-xl md:h-[560px]">
          <motion.img
            {...imgMotion}
            src={CTA_BANNER.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div
            className="absolute inset-0"
            style={{ backgroundColor: 'color-mix(in oklab, #2e3f51 40%, transparent)' }}
          />

          <div className="relative flex flex-col justify-start p-6 md:h-full md:p-10 lg:p-14">
            <motion.h2
              {...titleMotion}
              className="max-w-[1050px] text-[36px] font-medium leading-[1.15] text-white md:text-[48px] lg:text-[56px]"
            >
              {CTA_BANNER.title}
            </motion.h2>

            <motion.div {...buttonMotion} className="mt-6 max-w-[1050px]">
              <Button text={CTA_BANNER.buttonText} size="md" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
