// Карточка товара каталога: фото, цена, счётчик количества, кнопки корзины и избранного.

import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { motion, AnimatePresence } from 'motion/react'

import { Cart, Heart } from '@/components/ui/icons'
import useViewport from '@/hooks/useViewport'
import { useCartStore, useFavoritesStore } from '@/store'
import { cn } from '@/utils/cn'

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

// Белая капсула счётчика: −/+ как кнопки-иконки с серым hover-кругом (tagDate).
// Круг включается только при canHover, чтобы на тач-устройствах не залипал после тапа.
function QuantitySelector({ quantity, onDecrement, onIncrement, canHover }) {
  const stepClass = cn(
    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-navy transition-colors',
    canHover && 'hover:bg-tagDate'
  )

  return (
    <div
      className="flex shrink-0 items-center gap-0.5 rounded-full border border-divider bg-white p-1"
      onClick={stopNav}
    >
      <button type="button" onClick={onDecrement} className={stepClass}>
        −
      </button>
      <span className="w-6 text-center font-sans text-sm font-medium text-navy">{quantity}</span>
      <button type="button" onClick={onIncrement} className={stepClass}>
        +
      </button>
    </div>
  )
}

QuantitySelector.propTypes = {
  quantity: PropTypes.number.isRequired,
  onDecrement: PropTypes.func.isRequired,
  onIncrement: PropTypes.func.isRequired,
  canHover: PropTypes.bool.isRequired,
}

// Два состояния кнопки, производные от наличия товара в корзине: red «В корзину» ↔ navy «В корзине».
// Без зелёного интерлюда и таймера — после добавления кнопка сразу переходит в navy.
function CartButton({ productId, inStock, quantity }) {
  const addToCart = useCartStore((s) => s.addToCart)
  const removeFromCart = useCartStore((s) => s.removeFromCart)
  const inCart = useCartStore((s) => s.items.has(productId))

  const handleClick = (e) => {
    stopNav(e)
    if (!inStock) return
    if (!inCart) {
      addToCart(productId, quantity)
    } else {
      removeFromCart(productId)
    }
  }

  if (!inStock) {
    return <span className="font-sans text-sm font-medium text-muted">Нет в наличии</span>
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        // Узкая карточка (<224px) — строка стекается, кнопка во всю ширину; от 224px
        // (container-query) кнопка flex-1 рядом со счётчиком (min-w-0 разрешает сжатие).
        // Ширина задаётся w-full/flex-1, а не контентом — смена подписи не дёргает ширину.
        // h-[42px] = высота капсулы счётчика (h-8 + p-1 + border), чтобы низы строки совпадали.
        'flex h-[42px] w-full min-w-0 items-center justify-center gap-1.5 rounded-full px-3',
        'font-sans text-sm font-medium text-white',
        '@[224px]:w-auto @[224px]:flex-1',
        // Crossfade фона red ↔ navy
        'transition-colors duration-300',
        inCart ? 'bg-navy hover:bg-navy/90' : 'bg-red hover:bg-redHover'
      )}
    >
      <Cart size={16} className="shrink-0" />
      {/* Иконка статична, кроссфейд только подписи — кнопка не «пустеет» во время смены */}
      <span className="relative inline-flex">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={inCart ? 'in-cart' : 'idle'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {inCart ? 'В корзине' : 'В корзину'}
          </motion.span>
        </AnimatePresence>
      </span>
    </button>
  )
}

CartButton.propTypes = {
  productId: PropTypes.string.isRequired,
  inStock: PropTypes.bool.isRequired,
  quantity: PropTypes.number.isRequired,
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
  const unit = product.priceUnit ?? 'шт.'
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
      {/* Фото — квадрат 1:1: высота следует за шириной карточки, object-contain на белом фоне.
          Картинка позиционирована absolute (не в потоке): иначе вытянутый исходник (напр. 124×400)
          через flex-basis раздул бы shrink-0 фото-бокс выше aspect-ratio. p-3 перенесён на сам img. */}
      <div className="relative aspect-square shrink-0 bg-white">
        <span className="absolute left-2.5 top-2.5 z-10 p-2 font-sans text-[12px] font-medium text-navy">
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
        {/* Цена + разделитель + единица сгруппированы в w-fit-контейнер: divider (w-full)
            и подпись наследуют ширину цены, а gap контент-блока не растягивает линию. */}
        <div className="flex w-fit flex-col gap-1.5">
          <p className="font-sans text-navy">
            <span className="text-[28px] font-medium leading-none tracking-tight @[224px]:text-[34px]">
              {formatted}
            </span>
            <span className="text-sm text-muted">.{kopecks} &#8381;</span>
          </p>
          <div className="h-px w-full bg-black/10" />
          <p className="font-sans text-xs text-muted">за {unit}</p>
        </div>

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
              canHover={canHover}
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
    priceUnit: PropTypes.string,
    inStock: PropTypes.bool.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
}
