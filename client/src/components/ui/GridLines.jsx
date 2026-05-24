import PropTypes from 'prop-types'

import { cn } from '@/utils/cn'

/**
 * Декоративный overlay с вертикальными колоночными линиями (разделители N колонок = N-1 линия).
 *
 * Рендерит absolute-контейнер с тонкими линиями по ширине родителя.
 * По умолчанию занимает inset-0 родителя; переопределяется через className.
 *
 * @param {Object} props
 * @param {number} props.columns - Количество колонок (рендерит columns - 1 линий).
 * @param {string} [props.colorClass] - Tailwind-класс цвета (bg-*), по умолчанию bg-gridLine.
 * @param {string} [props.className] - Доп. классы для контейнера.
 */
export default function GridLines({ columns, colorClass = 'bg-gridLine', className }) {
  const lines = []
  for (let i = 1; i < columns; i++) {
    lines.push(
      <div
        key={i}
        className={cn('absolute bottom-0 top-0 w-px', colorClass)}
        style={{ left: `${(i / columns) * 100}%` }}
      />
    )
  }

  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0', className)}
    >
      {lines}
    </div>
  )
}

GridLines.propTypes = {
  columns: PropTypes.number.isRequired,
  colorClass: PropTypes.string,
  className: PropTypes.string,
}
