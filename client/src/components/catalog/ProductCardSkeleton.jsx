// Плейсхолдер карточки товара на время первичной загрузки страницы каталога.
// Размеры повторяют ProductCard (max-w-[250px], max-h-[450px], h-44 фото).

// Скелетон-карточка с пульсирующими блоками-заглушками.
export default function ProductCardSkeleton() {
  return (
    <div className="flex max-h-[450px] max-w-[250px] flex-col overflow-hidden rounded-xl bg-white shadow-sm">
      {/* Фото */}
      <div className="h-44 shrink-0 animate-pulse bg-tagDate" />

      {/* Контент */}
      <div className="flex flex-1 flex-col gap-2 px-4 pb-4 pt-3">
        {/* Цена */}
        <div className="h-8 w-24 animate-pulse rounded bg-tagDate" />
        {/* Название — 2 строки */}
        <div className="h-3 w-full animate-pulse rounded bg-tagDate" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-tagDate" />
        {/* Нижняя строка */}
        <div className="mt-auto flex items-center gap-2">
          <div className="h-8 w-20 animate-pulse rounded bg-tagDate" />
          <div className="h-8 flex-1 animate-pulse rounded bg-tagDate" />
        </div>
      </div>
    </div>
  )
}
