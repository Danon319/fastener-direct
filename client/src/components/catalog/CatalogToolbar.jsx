// Тулбар каталога: пилюля с управляющими элементами (передаются как children).
// Тулбар всегда fixed; позиция и ширина — чистые функции от scrollY с clamp (паттерн HeroHeader),
// поэтому докинг плавный и полностью обратимый, без таймеров и время-зависимых transition.
// При прокрутке бар поднимается из позиции покоя в док (top хедер-пилюли) и расширяется на всю
// ширину, а справа синхронно проявляется кнопка меню (≡).
import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import PropTypes from 'prop-types'

import { IconButton } from '@/components/ui'
import { Plus } from '@/components/ui/icons'

// Высота хедер-пилюли (Header.jsx, h-14). Док тулбара синхронизирован с уходом хедера: хедер уезжает
// translateY = -scrollY и полностью покидает верх ровно на scrollY = DOCK_TOP + HEADER_HEIGHT.
// Здесь же тулбар достигает DOCK_TOP — бесшовный свап без кадра наложения.
const HEADER_HEIGHT = 56
// Зазор пилюли (gap-2 = 0.5rem). Гасим его у reveal-обёртки ≡ в покое (её ширина 0), чтобы кнопка
// не «съедала» место у flex-1 SearchBar и позиция покоя не менялась.
const PILL_GAP = 8

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)

/**
 * Тулбар каталога. Управляющие элементы передаются как children и раскладываются в пилюле.
 * Всегда fixed; позиция (translateY) и ширина (max-width) — чистые функции от scrollY с clamp,
 * поэтому возврат вверх — точная инверсия прямого хода (нет сжатия-по-времени и прыжка).
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Контролы тулбара (фильтры, поиск, сортировка, категории).
 * @param {() => void} props.onMenuOpen - Открыть мобильное меню (кнопка ≡ доканного бара).
 */
export default function CatalogToolbar({ children, onMenuOpen }) {
  const anchorRef = useRef(null) // нулевой якорь естественной позиции (для restLift)
  const wrapperRef = useRef(null) // fixed-обёртка: с неё читаем DOCK_TOP (computed top)
  const spacerRef = useRef(null) // спейсер потока: его ширина = ширина покоя
  const pillRef = useRef(null) // сама пилюля — для высоты спейсера
  const revealRef = useRef(null) // естественная ширина группы «разделитель + ≡»

  // Геометрия дока, резолвится из реального layout (без JS-таблицы брейкпоинтов):
  // restLift — насколько ниже DOCK_TOP бар стоит в покое; swapEnd — scrollY, на котором бар встаёт
  // в DOCK_TOP (= момент ухода хедера); restWidth/dockedWidth — ширины; revealW — ширина ≡-группы.
  const [metrics, setMetrics] = useState({
    toolbarH: 64,
    restLift: 0,
    swapEnd: 1,
    restWidth: 0,
    dockedWidth: 0,
    revealW: 0,
  })

  // Замер до отрисовки (useLayoutEffect — без мелькания позиции на маунте) и перемер на resize и
  // изменении высоты пилюли (в т.ч. reflow после загрузки шрифтов) через ResizeObserver.
  useLayoutEffect(() => {
    const measure = () => {
      const anchor = anchorRef.current
      const wrapper = wrapperRef.current
      const spacer = spacerRef.current
      const pill = pillRef.current
      const reveal = revealRef.current
      if (!anchor || !wrapper || !spacer || !pill || !reveal) return

      // DOCK_TOP — used-значение CSS top (Tailwind top-2.5/md:top-7/lg:top-12); transform на него не влияет.
      const dockTop = parseFloat(getComputedStyle(wrapper).top) || 0
      // Позиция покоя по вертикали = doc-координата якоря (scroll-инвариантна).
      const anchorTopDoc = anchor.getBoundingClientRect().top + window.scrollY

      setMetrics({
        toolbarH: pill.offsetHeight,
        restLift: anchorTopDoc - dockTop,
        swapEnd: dockTop + HEADER_HEIGHT,
        restWidth: spacer.offsetWidth,
        // Доканный бар совпадает с инсетом хедер-пилюли (по dockTop с каждой стороны) — свап в ту же рамку.
        dockedWidth: window.innerWidth - 2 * dockTop,
        revealW: reveal.offsetWidth,
      })
    }

    measure()
    const ro = new ResizeObserver(measure)
    if (pillRef.current) ro.observe(pillRef.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  // Единый прогресс докинга p ∈ [0,1] и производные — всё чистые функции scrollY (clamp).
  const { scrollY } = useScroll()
  const progress = useTransform(scrollY, (y) => clamp01(y / metrics.swapEnd))
  const lift = useTransform(progress, (p) => metrics.restLift * (1 - p))
  const maxWidth = useTransform(
    progress,
    (p) => metrics.restWidth + (metrics.dockedWidth - metrics.restWidth) * p
  )
  // ≡ проявляется синхронно с докингом: ширина 0→естественная (clip), marginLeft гасит pill gap-2 в покое.
  const revealWidth = useTransform(progress, (p) => metrics.revealW * p)
  const revealMargin = useTransform(progress, (p) => -PILL_GAP * (1 - p))
  const boxShadow = useTransform(
    progress,
    [0, 1],
    ['0 6px 24px -12px rgba(28,32,36,0.25)', '0 14px 36px -10px rgba(28,32,36,0.5)']
  )

  return (
    <div className="relative">
      {/* Якорь позиции покоя + спейсер потока (бар всегда fixed, поэтому место резервирует спейсер). */}
      <div ref={anchorRef} aria-hidden="true" className="h-0" />
      <div ref={spacerRef} aria-hidden="true" style={{ height: metrics.toolbarH }} />

      <motion.div
        ref={wrapperRef}
        className="fixed inset-x-0 top-2.5 z-[60] md:top-7 lg:top-12"
        style={{ y: lift }}
      >
        <motion.div className="mx-auto" style={{ maxWidth }}>
          <motion.div
            ref={pillRef}
            className="flex items-center gap-2 rounded-full bg-white p-1.5 ring-1 ring-black/5"
            style={{ boxShadow }}
          >
            {children}
            {/* Коллапсирующая обёртка ≡: в покое width 0 (overflow-hidden клиппит кнопку — она не видна
                и не кликабельна, не влияет на flex-1 SearchBar). Раскрывается синхронно с докингом. */}
            <motion.div
              className="flex shrink-0 items-center overflow-hidden"
              style={{ width: revealWidth, marginLeft: revealMargin, opacity: progress }}
            >
              <div ref={revealRef} className="flex shrink-0 items-center gap-2">
                <span aria-hidden="true" className="h-6 w-px bg-divider" />
                <IconButton variant="slate" size={48} ariaLabel="Открыть меню" onClick={onMenuOpen}>
                  <Plus />
                </IconButton>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

CatalogToolbar.propTypes = {
  children: PropTypes.node.isRequired,
  onMenuOpen: PropTypes.func.isRequired,
}
