import EcomLayout from '@/layouts/ecom-layout'
import { Head, Link } from '@inertiajs/react'

interface OrderItem {
  id: string
  product_name: string
  product_image: string
  quantity: number
  unit_price: number
  total_price: number
  variation_data: Array<{
    type: { name: string }
    name: string
  }>
}

interface Order {
  id: string
  order_number: string
  status: string
  payment_status: string
  total_price: number
  billing_full_name: string
  billing_email: string
  billing_address: string
  billing_city: string
  billing_state: string
  billing_zip: string
  billing_country: string
  shipping_full_name: string
  shipping_address: string
  shipping_city: string
  shipping_state: string
  shipping_zip: string
  shipping_country: string
  created_at: string
  order_items: OrderItem[]
}

interface OrderCompleteProps {
  order: Order
}

export default function OrderComplete({ order }: OrderCompleteProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  return (
    <EcomLayout>
      <Head title={`Order Complete - ${order.order_number}`} />

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
            <span className="text-gray-800">Order Complete</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          {/* Success Message */}
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">Thank you for your order!</h1>
            <p className="text-gray-600">
              Your order has been placed successfully. We'll send you an email confirmation shortly.
            </p>
          </div>

          {/* Order Details */}
          <div className="mb-8 rounded-lg border bg-white shadow-sm">
            <div className="border-b p-6">
              <h2 className="mb-4 text-xl font-semibold">Order Details</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-600">Order Number</p>
                  <p className="font-medium">{order.order_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-medium">{order.created_at}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                    {order.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                    {order.payment_status}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-6">
              <h3 className="mb-4 text-lg font-semibold">Order Items</h3>
              <div className="space-y-4">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex items-center">
                    <div className="h-16 w-16 flex-shrink-0 rounded bg-gray-100">
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="h-16 w-16 rounded object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <h4 className="text-sm font-medium">{item.product_name}</h4>
                        <span className="text-sm font-medium">{formatPrice(item.total_price)}</span>
                      </div>
                      <div className="mt-1 flex justify-between">
                        {item.variation_data && item.variation_data.length > 0 && (
                          <span className="text-xs text-gray-500">
                            {item.variation_data
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
            </div>

            {/* Order Total */}
            <div className="border-t bg-gray-50 p-6">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-indigo-600">{formatPrice(order.total_price)}</span>
              </div>
            </div>
          </div>

          {/* Billing & Shipping Information */}
          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Billing Address */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold">Billing Address</h3>
              <div className="space-y-2 text-sm">
                <p className="font-medium">{order.billing_full_name}</p>
                <p>{order.billing_email}</p>
                <p>{order.billing_address}</p>
                <p>
                  {order.billing_city}, {order.billing_state} {order.billing_zip}
                </p>
                <p>{order.billing_country}</p>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold">Shipping Address</h3>
              <div className="space-y-2 text-sm">
                <p className="font-medium">{order.shipping_full_name}</p>
                <p>{order.shipping_address}</p>
                <p>
                  {order.shipping_city}, {order.shipping_state} {order.shipping_zip}
                </p>
                <p>{order.shipping_country}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center">
            <Link
              href={route('home')}
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white hover:bg-indigo-700"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </EcomLayout>
  )
}
