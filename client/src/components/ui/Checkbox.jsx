import PropTypes from 'prop-types'

import { cn } from '@/utils/cn'

/**
 * Кастомный чекбокс с скрытым нативным input для a11y.
 *
 * Поддерживает indeterminate-визуал (красная полоска вместо галочки),
 * когда передан флаг indeterminate (используется для tree-parent с частичным выбором).
 *
 * @param {Object} props
 * @param {boolean} props.checked - Текущее состояние.
 * @param {boolean} [props.indeterminate] - Если true, рисует indeterminate-индикатор.
 * @param {(e: React.ChangeEvent<HTMLInputElement>) => void} props.onChange - Обработчик.
 * @param {string} [props.label] - Текст справа от чекбокса. Если не задан — только индикатор.
 * @param {string} [props.labelClassName] - Доп. классы для текста лейбла.
 * @param {string} [props.className] - Доп. классы для внешнего <label>.
 */
export default function Checkbox({
  checked,
  indeterminate = false,
  onChange,
  label,
  labelClassName,
  className,
}) {
  const showCheck = checked && !indeterminate

  return (
    <label className={cn('flex cursor-pointer items-center gap-2.5 py-1.5', className)}>
      <span
        className={cn(
          'h-4.5 w-4.5 flex shrink-0 items-center justify-center rounded border transition-colors',
          checked || indeterminate ? 'border-red' : 'border-slate/30',
          showCheck ? 'bg-red' : 'bg-white'
        )}
        aria-hidden="true"
      >
        {showCheck && (
          <svg
            width={10}
            height={10}
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
        {indeterminate && <span className="block h-0.5 w-2 rounded bg-red" />}
      </span>
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      {label && (
        <span className={cn('font-sans text-sm text-navy', labelClassName)}>{label}</span>
      )}
    </label>
  )
}

Checkbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  indeterminate: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  labelClassName: PropTypes.string,
  className: PropTypes.string,
}
