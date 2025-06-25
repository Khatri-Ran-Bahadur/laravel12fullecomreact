import EcomLayout from '@/layouts/ecom-layout'
import { Head, Link, useForm } from '@inertiajs/react'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  options?: Array<{
    type: { name: string }
    name: string
  }>
}

interface PaymentProps {
  cartItems: CartItem[]
  totalQuantity: number
  totalPrice: number
  subtotal: number
  tax: number
  billing: any
  shipping: any
}
export default function Payment({
  cartItems,
  subtotal,
  tax,
  totalPrice,
  billing,
  shipping,
}: PaymentProps) {
  const { data, setData, post, processing, errors } = useForm({
    payment_method: 'card',
    agree: false,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    post(route('payment.process'))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }
  return (
    <EcomLayout>
      <Head title="Payment - ShopMart" />
      {/* Breadcrumb */}
      <div className="bg-gray-100 py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm text-gray-600">
            <Link href={route('home')} className="hover:text-indigo-600">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href={route('cart.index')} className="hover:text-indigo-600">
              Shopping Cart
            </Link>
            <span className="mx-2">/</span>
            <Link href={route('checkout')} className="hover:text-indigo-600">
              Checkout
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">Payment</span>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">Payment Method</h1>
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Payment Methods */}
          <div className="lg:w-2/3">
            <div className="mb-6 overflow-hidden rounded-lg bg-white shadow-sm">
              <div className="p-6">
                <h2 className="mb-4 text-lg font-semibold">Select Payment Method</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-6 space-y-4">
                    {/* Credit Card */}
                    <div className="overflow-hidden rounded-md border border-gray-200">
                      <label className="flex cursor-pointer items-center p-4">
                        <input
                          type="radio"
                          name="payment_method"
                          value="card"
                          checked={data.payment_method === 'card'}
                          onChange={(e) => setData('payment_method', e.target.value)}
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="ml-3 text-sm font-medium text-gray-900">
                          Credit / Debit Card
                        </span>
                      </label>
                      {data.payment_method === 'card' && (
                        <div className="border-t bg-gray-50 p-4">
                          {/* Card fields here */}
                          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                              <label className="mb-1 block text-sm font-medium text-gray-700">
                                Name on Card
                              </label>
                              <input
                                type="text"
                                className="w-full rounded-md border border-gray-300 px-3 py-2"
                                required
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-sm font-medium text-gray-700">
                                Card Number
                              </label>
                              <input
                                type="text"
                                className="w-full rounded-md border border-gray-300 px-3 py-2"
                                required
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            <div>
                              <label className="mb-1 block text-sm font-medium text-gray-700">
                                Month
                              </label>
                              <select
                                className="w-full rounded-md border border-gray-300 px-3 py-2"
                                required
                              >
                                <option value="">MM</option>
                                {[...Array(12)].map((_, i) => (
                                  <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                                    {String(i + 1).padStart(2, '0')}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="mb-1 block text-sm font-medium text-gray-700">
                                Year
                              </label>
                              <select
                                className="w-full rounded-md border border-gray-300 px-3 py-2"
                                required
                              >
                                <option value="">YY</option>
                                {[25, 26, 27, 28, 29, 30].map((y) => (
                                  <option key={y} value={y}>
                                    {y}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="col-span-2">
                              <label className="mb-1 block text-sm font-medium text-gray-700">
                                CVV
                              </label>
                              <input
                                type="text"
                                className="w-full rounded-md border border-gray-300 px-3 py-2"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* PayPal */}
                    <div className="overflow-hidden rounded-md border border-gray-200">
                      <label className="flex cursor-pointer items-center p-4">
                        <input
                          type="radio"
                          name="payment_method"
                          value="paypal"
                          checked={data.payment_method === 'paypal'}
                          onChange={(e) => setData('payment_method', e.target.value)}
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="ml-3 text-sm font-medium text-gray-900">PayPal</span>
                      </label>
                      {data.payment_method === 'paypal' && (
                        <div className="border-t bg-gray-50 p-4">
                          <p className="text-sm text-gray-600">
                            You will be redirected to PayPal to complete your payment.
                          </p>
                        </div>
                      )}
                    </div>
                    {/* Apple Pay */}
                    <div className="overflow-hidden rounded-md border border-gray-200">
                      <label className="flex cursor-pointer items-center p-4">
                        <input
                          type="radio"
                          name="payment_method"
                          value="apple-pay"
                          checked={data.payment_method === 'apple-pay'}
                          onChange={(e) => setData('payment_method', e.target.value)}
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="ml-3 text-sm font-medium text-gray-900">Apple Pay</span>
                      </label>
                      {data.payment_method === 'apple-pay' && (
                        <div className="border-t bg-gray-50 p-4">
                          <p className="text-sm text-gray-600">
                            You will be redirected to Apple Pay to complete your payment.
                          </p>
                        </div>
                      )}
                    </div>
                    {/* Cash on Delivery */}
                    <div className="overflow-hidden rounded-md border border-gray-200">
                      <label className="flex cursor-pointer items-center p-4">
                        <input
                          type="radio"
                          name="payment_method"
                          value="cod"
                          checked={data.payment_method === 'cod'}
                          onChange={(e) => setData('payment_method', e.target.value)}
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="ml-3 text-sm font-medium text-gray-900">
                          Cash on Delivery
                        </span>
                      </label>
                      {data.payment_method === 'cod' && (
                        <div className="border-t bg-gray-50 p-4">
                          <p className="text-sm text-gray-600">
                            You will pay with cash upon delivery.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={data.agree}
                        onChange={(e) => setData('agree', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        required
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        I agree to the{' '}
                        <a href="#" className="text-indigo-600 hover:text-indigo-800">
                          Terms & Conditions
                        </a>{' '}
                        and{' '}
                        <a href="#" className="text-indigo-600 hover:text-indigo-800">
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                  </div>
                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full rounded-md bg-indigo-600 py-3 text-white hover:bg-indigo-700"
                  >
                    {processing ? 'Processing...' : `Pay Now $${totalPrice}`}
                  </button>
                </form>
              </div>
            </div>
          </div>
          {/* Order Summary */}
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="sticky top-6 overflow-hidden rounded-lg bg-white shadow-sm">
              <div className="p-6">
                <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>

                <div className="mb-6 space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex">
                      <div className="h-16 w-16 flex-shrink-0 rounded bg-gray-100">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-16 w-16 rounded object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <h4 className="text-sm font-medium">{item.name}</h4>
                          <span className="text-sm font-medium">{formatPrice(item.price)}</span>
                        </div>
                        <div className="mt-1 flex justify-between">
                          {item.options && item.options.length > 0 && (
                            <span className="text-xs text-gray-500">
                              {item.options
                                .map((opt) => `${opt.type.name}: ${opt.name}`)
                                .join(', ')}
                            </span>
                          )}
                          <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">{formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-3 text-sm">
                    <span className="font-semibold">Total</span>
                    <span className="text-lg font-bold text-indigo-600">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </EcomLayout>
  )
}
