import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

import { useElementHeight } from '@/hooks'

export default function ProductPage() {
  const { id } = useParams()
  const footerH = useElementHeight('footer')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  return (
    <div className="min-h-screen bg-light">
      <div className="flex flex-col items-center justify-center px-4 pb-8 pt-28 md:px-8 md:pt-32 lg:px-12 lg:pt-36">
        <h1 className="mb-4 font-sans text-2xl font-medium text-navy">Страница товара #{id}</h1>
        <Link
          to="/catalog"
          className="font-sans text-sm text-red transition-colors hover:text-redHover"
        >
          Вернуться в каталог
        </Link>
      </div>
      <div style={{ height: footerH }} aria-hidden="true" />
    </div>
  )
}
