// Плейсхолдер карточки товара на время первичной загрузки страницы каталога.
// Габариты повторяют ProductCard: фото aspect-[4/5], высота от контента, отступы по @[224px].

// Скелетон-карточка с пульсирующими блоками-заглушками.
export default function ProductCardSkeleton() {
  return (
    <div className="@container flex h-full w-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm">
      {/* Фото */}
      <div className="aspect-[4/5] shrink-0 animate-pulse bg-tagDate" />

      {/* Контент */}
      <div className="flex flex-1 flex-col gap-2.5 px-3 pb-3 pt-3 @[224px]:gap-3 @[224px]:px-4 @[224px]:pb-4 @[224px]:pt-3.5">
        {/* Цена */}
        <div className="h-9 w-28 animate-pulse rounded bg-tagDate" />
        {/* Название — 2 строки */}
        <div className="h-3 w-full animate-pulse rounded bg-tagDate" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-tagDate" />
        {/* Нижняя строка */}
        <div className="mt-auto flex flex-col gap-2 @[224px]:flex-row @[224px]:items-center">
          <div className="h-8 w-20 shrink-0 animate-pulse rounded bg-tagDate" />
          <div className="h-8 w-full animate-pulse rounded bg-tagDate @[224px]:flex-1" />
        </div>
      </div>
    </div>
  )
}
