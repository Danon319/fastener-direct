import PropTypes from 'prop-types'

import { cn } from '@/utils/cn'

const DEFAULT_LINE_COLOR = '#d1d1d1'

/**
 * Декоративный overlay с вертикальными колоночными линиями (разделители N колонок = N-1 линия).
 *
 * Рендерит absolute-контейнер с тонкими линиями по ширине родителя.
 * По умолчанию занимает inset-0 родителя; переопределяется через className.
 *
 * @param {Object} props
 * @param {number} props.columns - Количество колонок (рендерит columns - 1 линий).
 * @param {string} [props.color] - Цвет линий (CSS color), по умолчанию #d1d1d1.
 * @param {string} [props.className] - Доп. классы для контейнера.
 */
export default function GridLines({ columns, color = DEFAULT_LINE_COLOR, className }) {
  const lines = []
  for (let i = 1; i < columns; i++) {
    lines.push(
      <div
        key={i}
        className="absolute bottom-0 top-0"
        style={{
          left: `${(i / columns) * 100}%`,
          width: '1px',
          backgroundColor: color,
        }}
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
  color: PropTypes.string,
  className: PropTypes.string,
}
