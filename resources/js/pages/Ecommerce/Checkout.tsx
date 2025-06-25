import EcomLayout from '@/layouts/ecom-layout'
import { Head, Link, useForm } from '@inertiajs/react'
import { useState } from 'react'

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

interface CheckoutProps {
  cartItems: CartItem[]
  totalQuantity: number
  totalPrice: number
  subtotal: number
  shipping: number
  tax: number
}

export default function Checkout({
  cartItems,
  totalQuantity,
  totalPrice,
  subtotal,
  shipping,
  tax,
}: CheckoutProps) {
  const [sameAsBilling, setSameAsBilling] = useState(true)

  const { data, setData, post, processing, errors } = useForm({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    notes: '',
    shipping_first_name: '',
    shipping_last_name: '',
    shipping_email: '',
    shipping_phone: '',
    shipping_address: '',
    shipping_city: '',
    shipping_state: '',
    shipping_zip: '',
    shipping_country: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post(route('checkout.process'))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  return (
    <EcomLayout>
      <Head title="Checkout - ShopMart" />

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
            <span className="text-gray-800">Checkout</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">Checkout</h1>

        {/* Checkout Progress */}
        <div className="mb-8 flex justify-center">
          <div className="w-full max-w-3xl">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600">
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                </div>
                <span className="mt-2 text-sm font-medium">Cart</span>
              </div>
              <div className="mx-2 h-1 flex-1 bg-indigo-600"></div>
              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600">
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="mt-2 text-sm font-medium">Details</span>
              </div>
              <div className="mx-2 h-1 flex-1 bg-gray-300"></div>
              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300">
                  <svg className="h-5 w-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                  </svg>
                </div>
                <span className="mt-2 text-sm text-gray-500">Payment</span>
              </div>
              <div className="mx-2 h-1 flex-1 bg-gray-300"></div>
              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300">
                  <svg className="h-5 w-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="mt-2 text-sm text-gray-500">Complete</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Customer Information Form */}
          <div className="lg:w-2/3">
            <div className="mb-6 overflow-hidden rounded-lg bg-white shadow-sm">
              <div className="p-6">
                <h2 className="mb-4 text-lg font-semibold">Billing Details</h2>

                <form onSubmit={handleSubmit}>
                  <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="first_name"
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        id="first_name"
                        value={data.first_name}
                        onChange={(e) => setData('first_name', e.target.value)}
                        className={`w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                          errors.first_name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      {errors.first_name && (
                        <p className="mt-1 text-sm text-red-500">{errors.first_name}</p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="last_name"
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="last_name"
                        value={data.last_name}
                        onChange={(e) => setData('last_name', e.target.value)}
                        className={`w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                          errors.last_name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      {errors.last_name && (
                        <p className="mt-1 text-sm text-red-500">{errors.last_name}</p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className={`w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        className={`w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="address"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Street Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      value={data.address}
                      onChange={(e) => setData('address', e.target.value)}
                      className={`w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                        errors.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                    )}
                  </div>

                  <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div>
                      <label
                        htmlFor="city"
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        value={data.city}
                        onChange={(e) => setData('city', e.target.value)}
                        className={`w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                          errors.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
                    </div>
                    <div>
                      <label
                        htmlFor="state"
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        State/Province
                      </label>
                      <input
                        type="text"
                        id="state"
                        value={data.state}
                        onChange={(e) => setData('state', e.target.value)}
                        className={`w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                          errors.state ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      {errors.state && <p className="mt-1 text-sm text-red-500">{errors.state}</p>}
                    </div>
                    <div>
                      <label htmlFor="zip" className="mb-1 block text-sm font-medium text-gray-700">
                        ZIP / Postal Code
                      </label>
                      <input
                        type="text"
                        id="zip"
                        value={data.zip}
                        onChange={(e) => setData('zip', e.target.value)}
                        className={`w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                          errors.zip ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      />
                      {errors.zip && <p className="mt-1 text-sm text-red-500">{errors.zip}</p>}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="country"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Country
                    </label>
                    <select
                      id="country"
                      value={data.country}
                      onChange={(e) => setData('country', e.target.value)}
                      className={`w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                        errors.country ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    >
                      <option value="">Select a country</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="AU">Australia</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="JP">Japan</option>
                      <option value="IN">India</option>
                    </select>
                    {errors.country && (
                      <p className="mt-1 text-sm text-red-500">{errors.country}</p>
                    )}
                  </div>

                  <div className="mb-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={sameAsBilling}
                        onChange={(e) => setSameAsBilling(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        Shipping address same as billing
                      </span>
                    </label>
                  </div>

                  {/* Shipping Address (shown when checkbox is unchecked) */}
                  {!sameAsBilling && (
                    <div className="mb-6 border-t pt-6">
                      <h3 className="mb-4 text-lg font-semibold">Shipping Address</h3>
                      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                          <label
                            htmlFor="shipping_first_name"
                            className="mb-1 block text-sm font-medium text-gray-700"
                          >
                            First Name
                          </label>
                          <input
                            type="text"
                            id="shipping_first_name"
                            value={data.shipping_first_name}
                            onChange={(e) => setData('shipping_first_name', e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="shipping_last_name"
                            className="mb-1 block text-sm font-medium text-gray-700"
                          >
                            Last Name
                          </label>
                          <input
                            type="text"
                            id="shipping_last_name"
                            value={data.shipping_last_name}
                            onChange={(e) => setData('shipping_last_name', e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="mb-6">
                        <label
                          htmlFor="shipping_address"
                          className="mb-1 block text-sm font-medium text-gray-700"
                        >
                          Street Address
                        </label>
                        <input
                          type="text"
                          id="shipping_address"
                          value={data.shipping_address}
                          onChange={(e) => setData('shipping_address', e.target.value)}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div>
                          <label
                            htmlFor="shipping_city"
                            className="mb-1 block text-sm font-medium text-gray-700"
                          >
                            City
                          </label>
                          <input
                            type="text"
                            id="shipping_city"
                            value={data.shipping_city}
                            onChange={(e) => setData('shipping_city', e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="shipping_state"
                            className="mb-1 block text-sm font-medium text-gray-700"
                          >
                            State/Province
                          </label>
                          <input
                            type="text"
                            id="shipping_state"
                            value={data.shipping_state}
                            onChange={(e) => setData('shipping_state', e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="shipping_zip"
                            className="mb-1 block text-sm font-medium text-gray-700"
                          >
                            ZIP / Postal Code
                          </label>
                          <input
                            type="text"
                            id="shipping_zip"
                            value={data.shipping_state}
                            onChange={(e) => setData('shipping_zip', e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="mb-6">
                        <label
                          htmlFor="shipping_country"
                          className="mb-1 block text-sm font-medium text-gray-700"
                        >
                          Country
                        </label>
                        <select
                          id="shipping_country"
                          value={data.shipping_country}
                          onChange={(e) => setData('shipping_country', e.target.value)}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        >
                          <option value="">Select a country</option>
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="UK">United Kingdom</option>
                          <option value="AU">Australia</option>
                          <option value="DE">Germany</option>
                          <option value="FR">France</option>
                          <option value="JP">Japan</option>
                          <option value="IN">India</option>
                        </select>
                      </div>
                    </div>
                  )}

                  <div className="mb-6">
                    <label htmlFor="notes" className="mb-1 block text-sm font-medium text-gray-700">
                      Order Notes (Optional)
                    </label>
                    <textarea
                      id="notes"
                      value={data.notes}
                      onChange={(e) => setData('notes', e.target.value)}
                      rows={3}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full rounded-md bg-indigo-600 py-3 text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {processing ? 'Processing...' : 'Proceed to Payment'}
                  </button>
                </form>
              </div>
            </div>
          </div>

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
