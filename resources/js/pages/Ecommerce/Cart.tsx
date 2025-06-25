import EcommerceLayout from '@/layouts/ecom-layout'
import { Link, router } from '@inertiajs/react'
import { ArrowLeft, Minus, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

interface CartItem {
  id: string | number
  product_id: number
  name: string
  slug: string
  quantity: number
  price: number
  option_ids: number[]
  options: Array<{
    id: number
    name: string
    type: {
      id: number
      name: string
    }
  }>
  image: string
}

interface CartProps {
  cartItems: CartItem[]
  cartCount: number
}

const Cart = ({ cartItems, cartCount }: CartProps) => {
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set())

  const updateQuantity = (item: CartItem, newQuantity: number) => {
    if (newQuantity < 1) return

    const itemKey = `${item.product_id}_${JSON.stringify(item.option_ids)}`
    setUpdatingItems((prev) => new Set(prev).add(itemKey))

    router.put(
      route('cart.update', { product: item.product_id }),
      {
        quantity: newQuantity,
        option_ids: item.option_ids,
      },
      {
        onFinish: () => {
          setUpdatingItems((prev) => {
            const newSet = new Set(prev)
            newSet.delete(itemKey)
            return newSet
          })
        },
      }
    )
  }

  const removeItem = (item: CartItem) => {
    router.delete(route('cart.delete', { product: item.product_id }), {
      data: {
        option_ids: item.option_ids,
      },
    })
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 0 // Free shipping
  const total = subtotal + shipping

  const handleCheckout = () => {
    router.get(route('checkout'))
  }

  if (cartItems.length === 0) {
    return (
      <EcommerceLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="mb-6">
              <svg
                className="mx-auto h-24 w-24 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                />
              </svg>
            </div>
            <h2 className="mb-4 text-2xl font-bold text-gray-800">Your cart is empty</h2>
            <p className="mb-8 text-gray-600">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link
              href="/"
              className="inline-flex items-center rounded-md bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </EcommerceLayout>
    )
  }

  return (
    <EcommerceLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link href="/" className="text-gray-500 hover:text-gray-700">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="ml-4 text-gray-500">Shopping Cart</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="rounded-lg bg-white shadow-sm">
              <div className="border-b px-6 py-4">
                <h1 className="text-xl font-semibold text-gray-800">
                  Shopping Cart ({cartCount} items)
                </h1>
              </div>
              <div className="divide-y">
                {cartItems.map((item) => {
                  const itemKey = `${item.product_id}_${JSON.stringify(item.option_ids)}`
                  const isUpdating = updatingItems.has(itemKey)

                  return (
                    <div key={itemKey} className="p-6">
                      <div className="flex items-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-20 w-20 rounded-md object-cover"
                        />
                        <div className="ml-4 flex-1">
                          <h3 className="text-lg font-medium text-gray-800">
                            <Link
                              href={route('product.detail', { slug: item.slug })}
                              className="hover:text-indigo-600"
                            >
                              {item.name}
                            </Link>
                          </h3>
                          {item.options.length > 0 && (
                            <div className="mt-1 text-sm text-gray-600">
                              {item.options.map((option) => (
                                <span key={option.id} className="mr-2">
                                  {option.type.name}: {option.name}
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="mt-2 text-lg font-semibold text-indigo-600">
                            ${item.price}
                          </div>
                        </div>
                        <div className="ml-4 flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item, item.quantity - 1)}
                            disabled={isUpdating}
                            className="rounded-md border p-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-12 text-center text-gray-800">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item, item.quantity + 1)}
                            disabled={isUpdating}
                            className="rounded-md border p-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="ml-4 text-right">
                          <div className="text-lg font-semibold text-gray-800">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                          <button
                            onClick={() => removeItem(item)}
                            className="mt-2 text-sm text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-800">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-800">Total</span>
                    <span className="text-lg font-semibold text-gray-800">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                className="mt-6 w-full rounded-md bg-indigo-600 px-4 py-3 text-white hover:bg-indigo-700"
              >
                Proceed to Checkout
              </button>
              <Link
                href="/"
                className="mt-3 block w-full rounded-md border border-gray-300 px-4 py-3 text-center text-gray-700 hover:bg-gray-50"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </EcommerceLayout>
  )
}

export default Cart
