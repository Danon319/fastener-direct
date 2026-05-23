import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { motion, AnimatePresence } from 'motion/react'

import { Heart } from '@/components/ui/icons'
import useViewport from '@/hooks/useViewport'
import { useCartStore } from '@/store/slices/cartSlice'
import { useFavoritesStore } from '@/store/slices/favoritesSlice'
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

function stopNav(e) {
  e.preventDefault()
  e.stopPropagation()
}

function QuantitySelector({ quantity, onDecrement, onIncrement }) {
  return (
    <div className="flex items-center gap-1" onClick={stopNav}>
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

  const handleClick = useCallback(
    (e) => {
      stopNav(e)
      if (!inStock) return
      if (!inCart) {
        addToCart(productId, quantity)
        setShowAdded(true)
      } else {
        removeFromCart(productId)
        setShowAdded(false)
      }
    },
    [inCart, inStock, productId, quantity, addToCart, removeFromCart]
  )

  if (!inStock) {
    return <span className="font-sans text-sm font-medium text-muted">Нет в наличии</span>
  }

  const state = showAdded ? 'added' : inCart ? 'in-cart' : 'idle'

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'relative min-w-28 overflow-hidden rounded-lg px-3 py-2 font-sans text-sm font-medium',
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

export default function ProductCard({ product }) {
  const { formatted, kopecks } = formatPrice(product.price)
  const { canHover } = useViewport()

  const inCart = useCartStore((s) => s.items.has(product.id))
  const cartQty = useCartStore((s) => s.items.get(product.id) || 0)
  const updateQuantity = useCartStore((s) => s.updateQuantity)

  const [localQty, setLocalQty] = useState(1)

  // Если товар в корзине — показываем количество из стора
  const displayQty = inCart ? cartQty : localQty

  const handleDecrement = useCallback(() => {
    if (inCart) {
      if (cartQty > 1) updateQuantity(product.id, cartQty - 1)
    } else {
      setLocalQty((q) => Math.max(1, q - 1))
    }
  }, [inCart, cartQty, product.id, updateQuantity])

  const handleIncrement = useCallback(() => {
    if (inCart) {
      updateQuantity(product.id, cartQty + 1)
    } else {
      setLocalQty((q) => q + 1)
    }
  }, [inCart, cartQty, product.id, updateQuantity])

  // Hotfix 7.13: при удалении товара из корзины переносим cartQty → localQty,
  // чтобы видимое количество не «прыгало» обратно к 1 и при повторном добавлении
  // ушло в корзину то значение, которое пользователь только что видел.
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
        // Hotfix 7.6: фиксированная h-[450px] (а не max-h) — единая высота для OOS и in-stock карточек.
        // Фото h-44 (176px) сохраняет ≤40% от высоты (176/450 = 39.1%).
        // Hotfix 7.7: добавлен w-full — карточка занимает всю ширину grid-ячейки (до max-w-[250px]),
        // иначе при отсутствии явной ширины карточка ужималась по содержимому.
        'flex h-[450px] w-full max-w-[250px] flex-col overflow-hidden rounded-xl bg-white shadow-sm transition duration-200',
        // Hover-эффект только на устройствах с курсором (canHover из useViewport)
        canHover && 'hover:-translate-y-1 hover:shadow-lg'
      )}
    >
      {/* Фото — фиксированная высота, чтобы строго удерживать ≤40% от max-h карточки (180/450) */}
      <div className="relative h-44 shrink-0 bg-white p-3">
        {/* Логотип бренда — верхний левый угол */}
        {product.brandLogo && (
          <img
            src={product.brandLogo}
            alt={product.brand}
            className="absolute left-2.5 top-2.5 z-10 h-8 w-8 object-contain"
          />
        )}
        <FavoriteButton productId={product.id} />
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-contain"
        />
      </div>

      {/* Информация о товаре: цена → название → нижняя строка */}
      <div className="flex flex-1 flex-col gap-2 px-4 pb-4 pt-3">
        {/* Цена — крупный размер */}
        <p className="font-sans text-navy">
          <span className="text-3xl font-medium">{formatted}</span>
          <span className="text-base text-muted">.{kopecks} &#8381;</span>
        </p>

        {/* Название — две строки, цвет navy */}
        <h3 className="line-clamp-2 font-sans text-sm font-medium leading-snug text-navy">
          {product.name}
        </h3>

        {/* Нижняя строка: либо счётчик+кнопка (в наличии), либо красное "Нет в наличии" (OOS) */}
        {product.inStock ? (
          <div className="mt-auto flex items-center gap-2">
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
    brandLogo: PropTypes.string,
    price: PropTypes.number.isRequired,
    inStock: PropTypes.bool.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
}
