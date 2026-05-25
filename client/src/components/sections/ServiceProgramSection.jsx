import { useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'

import { IconButton, Arrow } from '@/components/ui'
import { useViewport, useBreakpoint } from '@/hooks'
import { cn } from '@/utils/cn'
import { SECTION_LABEL, SERVICES } from '@/content/serviceProgram'

const ENTRANCE_STAGGER = 0.12

const rowVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut', delay: i * ENTRANCE_STAGGER },
  }),
}

const labelVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

// --- Dual-arrow swap (паттерн из Button.jsx) ---

function DualArrow({ size = 14, className }) {
  return (
    <span className={cn('relative block', className)} style={{ width: size, height: size }}>
      {/* Стрелка 1: видна в покое, уходит вправо с блюром при hover на строку */}
      <span
        className={cn(
          'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
          'transition-[transform,filter,opacity] duration-[220ms] ease-[cubic-bezier(0.55,0,0.9,0.4)]',
          'group-hover/row:translate-x-[150%] group-hover/row:opacity-0 group-hover/row:blur-sm'
        )}
      >
        <Arrow size={size} />
      </span>

      {/* Стрелка 2: скрыта слева, выезжает в центр при hover */}
      <span
        className={cn(
          'absolute left-1/2 top-1/2 -translate-x-[250%] -translate-y-1/2',
          'transition-transform duration-[400ms] ease-in-out',
          'group-hover/row:-translate-x-1/2'
        )}
      >
        <Arrow size={size} />
      </span>
    </span>
  )
}

// --- Строка для десктопа ---

function DesktopRow({ service, index, hoveredId, onHover, onLeave, isLast }) {
  const isHovered = hoveredId === service.id

  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })

  return (
    <motion.div
      ref={ref}
      variants={rowVariants}
      custom={index}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      onMouseEnter={() => onHover(service.id)}
      onMouseLeave={onLeave}
      className={cn(
        'group/row relative grid cursor-pointer grid-cols-[1.25fr_1fr_auto] items-center gap-6 rounded-2xl px-6 py-6 md:py-8 lg:py-20',
        'transition-colors duration-300',
        isHovered ? 'bg-red' : 'bg-transparent'
      )}
    >
      {!isLast && (
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-divider transition-opacity duration-300',
            isHovered && 'opacity-0'
          )}
        />
      )}
      <span
        className={cn(
          'text-xl font-medium transition-colors duration-300 md:text-2xl lg:text-5xl',
          isHovered ? 'text-white' : 'text-navy'
        )}
      >
        {service.title}
      </span>
      <p
        className={cn(
          'text-sm transition-[color,transform] duration-300 lg:text-base',
          isHovered ? 'translate-x-0 text-white/90' : 'translate-x-6 text-muted lg:translate-x-12'
        )}
      >
        {service.description}
      </p>
      <IconButton
        variant={isHovered ? 'dark' : 'light'}
        size={40}
        visible={isHovered}
        interactive
        ariaLabel={service.title}
      >
        <DualArrow />
      </IconButton>
    </motion.div>
  )
}

// --- Строка для мобильного / планшета ---

function MobileRow({ service, index, isLast }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      variants={rowVariants}
      custom={index}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={cn('flex flex-col gap-4 py-8 md:py-10', !isLast && 'border-b border-divider')}
    >
      <h3 className="text-xl font-medium text-navy md:text-2xl">{service.title}</h3>
      <p className="text-sm text-muted">{service.description}</p>
      <div>
        <IconButton variant="filled" size={40} interactive ariaLabel={service.title}>
          <Arrow />
        </IconButton>
      </div>
    </motion.div>
  )
}

// --- Основная секция ---

/**
 * Секция «Сервисная программа».
 * Десктоп (>=lg + hover): 2-колоночная сетка, наведение делает строку красной.
 * Мобильный/планшет: одна колонка, строки с разделителями, filled IconButton.
 */
export default function ServiceProgramSection() {
  const { canHover } = useViewport()
  const isLarge = useBreakpoint('lg', true)
  const isDesktop = isLarge && canHover
  const [hoveredId, setHoveredId] = useState(null)

  const labelRef = useRef(null)
  const labelInView = useInView(labelRef, { once: true, amount: 0.3 })

  return (
    <section className="bg-white px-4 py-16 md:px-8 md:py-20 lg:px-16 lg:py-24">
      <div className={cn('mx-auto max-w-7xl lg:px-12', isDesktop && 'grid grid-cols-3 gap-12')}>
        {/* Label */}
        <motion.p
          ref={labelRef}
          variants={labelVariants}
          initial="hidden"
          animate={labelInView ? 'visible' : 'hidden'}
          className={cn('text-2xl font-medium text-muted', !isDesktop && 'mb-8')}
        >
          {SECTION_LABEL}
        </motion.p>

        {/* Rows */}
        <div className={isDesktop ? 'col-span-2' : ''}>
          {SERVICES.map((service, i) =>
            isDesktop ? (
              <DesktopRow
                key={service.id}
                service={service}
                index={i}
                hoveredId={hoveredId}
                onHover={setHoveredId}
                onLeave={() => setHoveredId(null)}
                isLast={i === SERVICES.length - 1}
              />
            ) : (
              <MobileRow
                key={service.id}
                service={service}
                index={i}
                isLast={i === SERVICES.length - 1}
              />
            )
          )}
        </div>
      </div>
    </section>
  )
}
