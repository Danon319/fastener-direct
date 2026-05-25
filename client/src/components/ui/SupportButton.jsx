import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { Arrow } from '@/components/ui/icons'
import { useScrollDirection } from '@/hooks'
import { cn } from '@/utils/cn'

const ARROW_SIZE = 18

/**
 * Фиксированная кнопка «Поддержка» в правом нижнем углу.
 * Desktop (≥md): pill с иконкой, текстом и круглой стрелкой вверх.
 * Mobile (<md): компактная кнопка только с иконкой.
 * Появляется когда Hero скрыт, исчезает когда Footer входит в viewport.
 */
export default function SupportButton() {
  const heroThreshold = typeof window !== 'undefined' ? window.innerHeight / 2 : 0
  const { isPastThreshold, direction } = useScrollDirection({ threshold: heroThreshold })

  const [isFooterZone, setIsFooterZone] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const footer = document.querySelector('footer')
      if (!footer) return
      const footerH = footer.offsetHeight
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      setIsFooterZone(window.scrollY >= maxScroll - footerH)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const visible = isPastThreshold && !isFooterZone && direction === 'down'

  return (
    <Link
      to="/support"
      className={cn(
        'group/support fixed bottom-8 right-8 z-header',
        'transition-opacity duration-300',
        visible ? 'opacity-100' : 'pointer-events-none opacity-0'
      )}
    >
      {/* Mobile: компактная кнопка с иконкой */}
      <div className="flex h-[50px] w-[50px] items-center justify-center rounded-[6px] bg-red md:hidden">
        <img src="/icons/support_icon.svg" alt="" className="h-6 w-6 brightness-0 invert" />
      </div>

      {/* Desktop: pill-кнопка */}
      <div className="hidden items-center gap-[18px] rounded-[6px] bg-red p-[10px_16px_10px_16px] md:flex">
        <span className="text-[24px] font-medium text-white">Поддержка</span>

        {/* Круг со стрелкой вверх — двойная стрелка из Button.jsx, повёрнут -90° */}
        <span
          className={cn(
            'relative shrink-0 overflow-hidden rounded-full',
            'h-[50px] w-[50px] -rotate-90',
            'border-[1.5px] border-white/40 bg-transparent',
            'transition-[transform,background-color,border-color] duration-300 ease-in-out',
            'group-hover/support:scale-[1.18] group-hover/support:border-transparent group-hover/support:bg-redHover'
          )}
        >
          {/* Стрелка 1: видна в покое, уходит при наведении */}
          <span
            className={cn(
              'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
              'transition-[transform,filter,opacity] duration-[220ms] ease-[cubic-bezier(0.55,0,0.9,0.4)]',
              'group-hover/support:translate-x-[150%] group-hover/support:opacity-0 group-hover/support:blur-sm'
            )}
          >
            <Arrow size={ARROW_SIZE} className="text-white" />
          </span>

          {/* Стрелка 2: скрыта, выезжает в центр при наведении */}
          <span
            className={cn(
              'absolute left-1/2 top-1/2 -translate-x-[250%] -translate-y-1/2',
              'transition-transform duration-[400ms] ease-in-out',
              'group-hover/support:-translate-x-1/2'
            )}
          >
            <Arrow size={ARROW_SIZE} className="text-white" />
          </span>
        </span>
      </div>
    </Link>
  )
}
