import { Component } from 'react'
import PropTypes from 'prop-types'

/**
 * Перехватывает исключения, брошенные при рендере дочерних компонентов, и
 * показывает фолбэк-экран вместо краша всего приложения.
 *
 * Ловит только ошибки фазы рендера/lifecycle. Ошибки в обработчиках событий и
 * в асинхронном коде (setTimeout, fetch) сюда не попадают — но они и не роняют
 * дерево React.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Защищаемое поддерево.
 */
export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    // Единственная точка логирования ошибки. Сюда позже подключается мониторинг
    // (Sentry и т.п.); пока — вывод в консоль, иначе ошибка теряется без следа.
    console.error('ErrorBoundary:', error, info)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-light px-4 text-center">
          <h1 className="font-sans text-2xl font-medium text-navy">Что-то пошло не так</h1>
          <p className="max-w-md font-sans text-sm text-muted">
            Произошла ошибка при отображении страницы. Попробуйте обновить — если не
            поможет, вернитесь позже.
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            className="rounded-full bg-red px-5 py-2.5 font-sans text-sm font-medium text-white transition-colors hover:bg-redHover"
          >
            Обновить страницу
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
}
