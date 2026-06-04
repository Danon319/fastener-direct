// Карточка товара каталога: фото, цена, счётчик количества, кнопки корзины и избранного.

import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { motion, AnimatePresence } from 'motion/react'

import { Heart } from '@/components/ui/icons'
import useViewport from '@/hooks/useViewport'
import { useCartStore, useFavoritesStore } from '@/store'
import { cn } from '@/utils/cn'

// Длительность состояния "Добавлено" перед переходом в "В корзине"
const ADDED_DURATION = 1500

function formatPrice(price) {
  const integer = Math.floor(price)
  const kopecks = Math.round((price - integer) * 100)
    .toString()
    .padStart(2, '0')
  const formatted = integer.toLocaleString('ru-RU')
  return { formatted, kopecks }
}

// Гасит переход по ссылке-карточке при клике по внутренним кнопкам (счётчик, корзина, избранное).
function stopNav(e) {
  e.preventDefault()
  e.stopPropagation()
}

function QuantitySelector({ quantity, onDecrement, onIncrement }) {
  return (
    <div className="flex shrink-0 items-center gap-1" onClick={stopNav}>
      <button
        type="button"
        onClick={onDecrement}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-light text-navy transition-colors hover:bg-light"
      >
        −
      </button>
      <span className="w-6 text-center font-sans text-sm font-medium text-navy">{quantity}</span>
      <button
        type="button"
        onClick={onIncrement}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-light text-navy transition-colors hover:bg-light"
      >
        +
      </button>
    </div>
  )
}

QuantitySelector.propTypes = {
  quantity: PropTypes.number.isRequired,
  onDecrement: PropTypes.func.isRequired,
  onIncrement: PropTypes.func.isRequired,
}

// Состояния кнопки корзины: "idle" | "added" | "in-cart"
function CartButton({ productId, inStock, quantity }) {
  const addToCart = useCartStore((s) => s.addToCart)
  const removeFromCart = useCartStore((s) => s.removeFromCart)
  const inCart = useCartStore((s) => s.items.has(productId))
  const [showAdded, setShowAdded] = useState(false)

  // Авто-сброс состояния "added" через ADDED_DURATION мс
  useEffect(() => {
    if (!showAdded) return
    const t = setTimeout(() => setShowAdded(false), ADDED_DURATION)
    return () => clearTimeout(t)
  }, [showAdded])

  const handleClick = (e) => {
    stopNav(e)
    if (!inStock) return
    if (!inCart) {
      addToCart(productId, quantity)
      setShowAdded(true)
    } else {
      removeFromCart(productId)
      setShowAdded(false)
    }
  }

  if (!inStock) {
    return <span className="font-sans text-sm font-medium text-muted">Нет в наличии</span>
  }

  const state = showAdded ? 'added' : inCart ? 'in-cart' : 'idle'

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        // Узкая карточка (<224px) — строка стекается, кнопка во всю ширину; от 224px
        // (container-query) кнопка flex-1 рядом со счётчиком (min-w-0 разрешает сжатие).
        'relative w-full min-w-0 overflow-hidden rounded-lg px-3 py-2 font-sans text-sm font-medium',
        '@[224px]:w-auto @[224px]:flex-1',
        'transition-colors duration-300',
        state === 'idle' && 'bg-red text-white hover:bg-redHover',
        state === 'added' && 'bg-green-600 text-white',
        state === 'in-cart' && 'border border-slate bg-transparent text-navy hover:bg-light'
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={state}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center gap-1.5"
        >
          {state === 'idle' && 'В корзину'}
          {state === 'added' && (
            <>
              <CheckIcon />
              Добавлено
            </>
          )}
          {state === 'in-cart' && 'В корзине'}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}

CartButton.propTypes = {
  productId: PropTypes.string.isRequired,
  inStock: PropTypes.bool.isRequired,
  quantity: PropTypes.number.isRequired,
}

function CheckIcon() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function FavoriteButton({ productId }) {
  const toggleItem = useFavoritesStore((s) => s.toggleItem)
  const isFav = useFavoritesStore((s) => s.items.has(productId))

  return (
    <button
      type="button"
      onClick={(e) => {
        stopNav(e)
        toggleItem(productId)
      }}
      aria-label={isFav ? 'Убрать из избранного' : 'Добавить в избранное'}
      className="absolute right-2.5 top-2.5 z-10 flex items-center justify-center rounded-full bg-white/80 p-2 backdrop-blur-sm transition-colors hover:bg-white"
    >
      <motion.span
        key={isFav ? 'filled' : 'outline'}
        initial={{ scale: 0.6 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        className="flex"
      >
        <Heart size={18} filled={isFav} className={isFav ? 'text-red' : 'text-muted'} />
      </motion.span>
    </button>
  )
}

FavoriteButton.propTypes = {
  productId: PropTypes.string.isRequired,
}

/**
 * Карточка товара: фото, цена, счётчик количества и кнопки «в корзину» / «в избранное».
 *
 * @param {Object} props
 * @param {Object} props.product - Данные товара (id, name, price, brand, article, image, inStock и т.д.).
 */
export default function ProductCard({ product }) {
  const { formatted, kopecks } = formatPrice(product.price)
  const { canHover } = useViewport()

  // Состояние корзины для этого товара: лежит ли он там, сколько штук и функция смены количества.
  const inCart = useCartStore((s) => s.items.has(product.id))
  const cartQty = useCartStore((s) => s.items.get(product.id) || 0)
  const updateQuantity = useCartStore((s) => s.updateQuantity)

  const [localQty, setLocalQty] = useState(1)

  // Если товар в корзине — показываем количество из стора
  const displayQty = inCart ? cartQty : localQty

  const handleDecrement = () => {
    if (inCart) {
      if (cartQty > 1) updateQuantity(product.id, cartQty - 1)
    } else {
      setLocalQty((q) => Math.max(1, q - 1))
    }
  }

  const handleIncrement = () => {
    if (inCart) {
      updateQuantity(product.id, cartQty + 1)
    } else {
      setLocalQty((q) => q + 1)
    }
  }

  // При удалении из корзины сохраняем cartQty в localQty — при повторном добавлении
  // уйдёт то количество, которое пользователь только что видел.
  const prevCartQtyRef = useRef(0)
  useEffect(() => {
    if (inCart) {
      prevCartQtyRef.current = cartQty
    } else if (prevCartQtyRef.current > 0) {
      setLocalQty(prevCartQtyRef.current)
      prevCartQtyRef.current = 0
    }
  }, [inCart, cartQty])

  return (
    <Link
      to={`/product/${product.id}`}
      className={cn(
        // Без фикс-высоты: h-full тянет карточку на высоту ряда сетки (align stretch),
        // а mt-auto на нижней строке выравнивает низы OOS и in-stock карточек в линию.
        // Без max-w: карточка заполняет ячейку сетки, ширину задаёт число колонок (CatalogPage).
        // @container — внутренние отступы/типографика и раскладка нижней строки реагируют
        // на ширину самой карточки (container-query, порог @[224px]).
        '@container flex h-full w-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition duration-200',
        // Hover-эффект только на устройствах с курсором (canHover из useViewport)
        canHover && 'hover:-translate-y-1 hover:shadow-lg'
      )}
    >
      {/* Фото — портрет 4:5: высота следует за шириной карточки, object-contain на белом фоне.
          Картинка позиционирована absolute (не в потоке): иначе вытянутый исходник (напр. 124×400)
          через flex-basis раздул бы shrink-0 фото-бокс выше aspect-ratio. p-3 перенесён на сам img. */}
      <div className="relative aspect-[4/5] shrink-0 bg-white">
        <span className="absolute left-2.5 top-2.5 z-10 font-sans text-[12px] font-medium text-navy">
          {product.article}
        </span>
        <FavoriteButton productId={product.id} />
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-contain p-3"
        />
      </div>

      {/* Информация о товаре: цена → название → нижняя строка. Отступы и кегль
          компактнее на узкой карточке, просторнее от @[224px] (container-query). */}
      <div className="flex flex-1 flex-col gap-2.5 px-3 pb-3 pt-3 @[224px]:gap-3 @[224px]:px-4 @[224px]:pb-4 @[224px]:pt-3.5">
        <p className="font-sans text-navy">
          <span className="text-[28px] font-medium leading-none tracking-tight @[224px]:text-[34px]">
            {formatted}
          </span>
          <span className="text-sm text-muted">.{kopecks} &#8381;</span>
        </p>

        <h3 className="line-clamp-2 font-sans text-[13px] font-medium leading-snug text-navy @[224px]:text-sm">
          {product.name}
        </h3>

        {/* Нижняя строка: либо счётчик+кнопка (в наличии), либо красное "Нет в наличии" (OOS) */}
        {product.inStock ? (
          <div className="mt-auto flex flex-col gap-2 @[224px]:flex-row @[224px]:items-center">
            <QuantitySelector
              quantity={displayQty}
              onDecrement={handleDecrement}
              onIncrement={handleIncrement}
            />
            <CartButton productId={product.id} inStock quantity={displayQty} />
          </div>
        ) : (
          <p className="mt-auto text-center font-sans text-sm font-medium text-red">
            Нет в наличии
          </p>
        )}
      </div>
    </Link>
  )
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    parentCategory: PropTypes.string.isRequired,
    subcategory: PropTypes.string.isRequired,
    brand: PropTypes.string.isRequired,
    article: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    inStock: PropTypes.bool.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
}
