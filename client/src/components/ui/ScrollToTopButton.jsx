// Плавающая FAB в правом нижнем углу: прокручивает страницу к началу.
// Появляется после прокрутки больше SHOW_THRESHOLD пикселей.
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

import IconButton from '@/components/ui/IconButton'
import { Arrow } from '@/components/ui/icons'

const SHOW_THRESHOLD = 300
// 60px — 1.5× базового размера IconButton (40), иконка масштабируется пропорционально (size * 0.36).
const BUTTON_SIZE = 60

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_THRESHOLD)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-[30px] right-[30px] z-50"
        >
          {/* IconButton перезаписывает className на дочерней иконке, поэтому поворот SVG
              задаём через arbitrary-вариант на самой кнопке. */}
          <IconButton
            variant="filled"
            size={BUTTON_SIZE}
            onClick={handleClick}
            ariaLabel="Наверх"
            className="[&_svg]:-rotate-90"
          >
            <Arrow />
          </IconButton>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
