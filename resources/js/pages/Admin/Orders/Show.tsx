import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import AppLayout from '@/layouts/app-layout'
import { Head, router } from '@inertiajs/react'
import {
  ArrowLeft,
  Calendar,
  Clock,
  CreditCard,
  MapPin,
  Package2,
  Printer,
  User,
  Truck,
  FileText,
} from 'lucide-react'
import { useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import OrderInvoice from './OrderInvoice'

// Type definitions
interface OrderItem {
  id: string | number
  product_name: string
  product_image?: string
  product_sku?: string
  quantity: number
  unit_price: number
  total_price: number
  notes?: string
  variation_data?: Array<{
    id: number
    name: string
    type: {
      id: number
      name: string
    }
  }>
  product?: {
    brand?: {
      name: string
    }
    category?: {
      name: string
    }
  }
}

interface User {
  name: string
  email: string
  phone?: string
}

interface Order {
  id: string | number
  order_number: string
  created_at: string
  status: keyof typeof ORDER_STATUSES
  payment_status: keyof typeof PAYMENT_STATUSES
  tracking_number?: string
  admin_notes?: string
  subtotal: number
  tax_amount: number
  shipping_amount: number
  discount_amount: number
  total_price: number
  payment_method: string
  billing_full_name: string
  billing_email: string
  billing_phone?: string
  billing_address: string
  billing_city: string
  billing_state: string
  billing_zip: string
  billing_country: string
  is_shipping_same_as_billing: boolean
  shipping_full_name?: string
  shipping_address?: string
  shipping_city?: string
  shipping_state?: string
  shipping_zip?: string
  shipping_country?: string
  customer_notes?: string
  order_items: OrderItem[]
  user: User
}

const ORDER_STATUSES = {
  pending: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  },
  confirmed: {
    label: 'Confirmed',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  },
  preparing: {
    label: 'Preparing',
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  },
  ready_for_pickup: {
    label: 'Ready for Pickup',
    color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
  },
  out_for_delivery: {
    label: 'Out for Delivery',
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  },
  delivered: {
    label: 'Delivered',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  },
  completed: {
    label: 'Completed',
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  },
} as const

const PAYMENT_STATUSES = {
  pending: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  },
  paid: {
    label: 'Paid',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  },
  failed: {
    label: 'Failed',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  },
  refunded: {
    label: 'Refunded',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
  },
} as const

const formatPrice = (price: number | string | null | undefined): string => {
  const currency = 'USD'
  const numericPrice = Number(price)
  if (isNaN(numericPrice)) {
    return '0 ' + currency
  }
  if (numericPrice % 1 === 0) {
    return numericPrice + ' ' + currency
  }
  return numericPrice.toFixed(2) + ' ' + currency
}

const getVariationDetails = (item: OrderItem) => {
  if (!item.variation_data || !Array.isArray(item.variation_data)) {
    return null
  }
  return item.variation_data
}

interface OrderShowProps {
  order: Order
}

export default function OrderShow({ order }: OrderShowProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
  })

  const [formData, setFormData] = useState({
    status: order.status,
    payment_status: order.payment_status,
    tracking_number: order.tracking_number || '',
    admin_notes: order.admin_notes || '',
  })

  const handleStatusUpdate = () => {
    // Check if route function exists
    if (typeof route === 'undefined') {
      console.error('Route helper function is not available')
      return
    }

    router.put(route('admin.orders.update', order.id), formData, {
      onSuccess: () => {
        console.log('Order updated successfully')
        // You can replace this with your preferred notification system
      },
      onError: (errors) => {
        console.error('Failed to update order:', errors)
        // You can replace this with your preferred error handling
      },
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleBackNavigation = () => {
    // Check if route function exists
    if (typeof route === 'undefined') {
      // Fallback navigation
      window.history.back()
      return
    }
    router.get(route('admin.orders.index'))
  }

  return (
    <AppLayout>
      <Head title={`Order #${order.order_number}`} />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 dark:from-gray-900 dark:to-gray-800">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={handleBackNavigation}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Order Information */}
          <div className="space-y-6 lg:col-span-2">
            {/* Order Header */}
            <Card>
              <CardHeader className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Order #{order.order_number}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {new Date(order.created_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge
                      className={ORDER_STATUSES[order.status]?.color || 'bg-gray-100 text-gray-800'}
                    >
                      {ORDER_STATUSES[order.status]?.label || 'Unknown'}
                    </Badge>
                    <Badge
                      className={
                        PAYMENT_STATUSES[order.payment_status]?.color || 'bg-gray-100 text-gray-800'
                      }
                    >
                      {PAYMENT_STATUSES[order.payment_status]?.label || 'Unknown'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.order_items && order.order_items.length > 0 ? (
                    order.order_items.map((item) => {
                      const variationDetails = getVariationDetails(item)
                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between border-b border-gray-200 pb-4 last:border-0 last:pb-0"
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={item.product_image || '/images/placeholder.png'}
                              alt={item.product_name}
                              className="h-16 w-16 rounded-lg object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = '/images/placeholder.png'
                              }}
                            />
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{item.product_name}</h3>
                                {item.product?.brand && (
                                  <Badge variant="outline" className="text-xs">
                                    {typeof item.product.brand === 'string'
                                      ? item.product.brand
                                      : item.product.brand.name}
                                  </Badge>
                                )}
                              </div>

                              {item.product?.category && (
                                <p className="text-xs text-gray-500">
                                  {typeof item.product.category === 'string'
                                    ? item.product.category
                                    : item.product.category.name}
                                </p>
                              )}

                              {item.product_sku && (
                                <p className="text-xs text-gray-500">SKU: {item.product_sku}</p>
                              )}

                              {variationDetails && variationDetails.length > 0 && (
                                <div className="space-y-1">
                                  {variationDetails.map((detail, index) => (
                                    <p key={index} className="text-sm text-gray-500">
                                      {detail.type.name}: {detail.name}
                                    </p>
                                  ))}
                                </div>
                              )}

                              <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>

                              {item.notes && (
                                <p className="text-sm text-gray-500 italic">{item.notes}</p>
                              )}
                            </div>
                          </div>
                          <div className="space-y-1 text-right">
                            <p className="font-medium">{formatPrice(item.unit_price)}</p>
                            <p className="text-sm font-medium">
                              Total: {formatPrice(item.total_price)}
                            </p>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-gray-500">No items found</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal:</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">Tax:</span>
                    <span>{formatPrice(order.tax_amount)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">Shipping:</span>
                    <span>{formatPrice(order.shipping_amount)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">Discount:</span>
                    <span className="text-red-500">-{formatPrice(order.discount_amount)}</span>
                  </div>

                  <div className="flex justify-between border-t border-gray-200 pt-2 font-medium">
                    <span>Total:</span>
                    <span>{formatPrice(order.total_price)}</span>
                  </div>

                  {/* Additional Order Information */}
                  <div className="mt-4 space-y-2 border-t border-gray-200 pt-4">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Payment Method:</span>
                      <span className="capitalize">
                        {order.payment_method?.replace(/_/g, ' ') || 'Unknown'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Payment Status:</span>
                      <span className="capitalize">
                        {order.payment_status?.charAt(0).toUpperCase() +
                          order.payment_status?.slice(1) || 'Unknown'}
                      </span>
                    </div>
                    {order.tracking_number && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Tracking Number:</span>
                        <span>{order.tracking_number}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{order.user?.name || 'N/A'}</p>
                  <p className="text-sm text-gray-500">{order.user?.email || 'N/A'}</p>
                  {order.user?.phone && <p className="text-sm text-gray-500">{order.user.phone}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Billing Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Billing Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{order.billing_full_name || 'N/A'}</p>
                  <p className="text-sm text-gray-500">{order.billing_email || 'N/A'}</p>
                  {order.billing_phone && (
                    <p className="text-sm text-gray-500">{order.billing_phone}</p>
                  )}
                  <div className="text-sm text-gray-500">
                    <p>{order.billing_address || 'N/A'}</p>
                    <p>
                      {order.billing_city || 'N/A'}, {order.billing_state || 'N/A'}{' '}
                      {order.billing_zip || ''}
                    </p>
                    <p>{order.billing_country || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {order.is_shipping_same_as_billing ? (
                    <Badge variant="outline" className="mb-2">
                      Same as Billing
                    </Badge>
                  ) : (
                    <>
                      <p className="font-medium">{order.shipping_full_name || 'N/A'}</p>
                      <div className="text-sm text-gray-500">
                        <p>{order.shipping_address || 'N/A'}</p>
                        <p>
                          {order.shipping_city || 'N/A'}, {order.shipping_state || 'N/A'}{' '}
                          {order.shipping_zip || ''}
                        </p>
                        <p>{order.shipping_country || 'N/A'}</p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Notes */}
            {order.customer_notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Customer Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{order.customer_notes}</p>
                </CardContent>
              </Card>
            )}

            {/* Status Update */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package2 className="h-5 w-5" />
                  Update Order
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="status">Order Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleInputChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ORDER_STATUSES).map(([value, { label }]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="payment_status">Payment Status</Label>
                  <Select
                    value={formData.payment_status}
                    onValueChange={(value) => handleInputChange('payment_status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment status" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(PAYMENT_STATUSES).map(([value, { label }]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tracking_number">Tracking Number</Label>
                  <Input
                    id="tracking_number"
                    value={formData.tracking_number}
                    onChange={(e) => handleInputChange('tracking_number', e.target.value)}
                    placeholder="Enter tracking number"
                  />
                </div>

                <div>
                  <Label htmlFor="admin_notes">Admin Notes</Label>
                  <Textarea
                    id="admin_notes"
                    value={formData.admin_notes}
                    onChange={(e) => handleInputChange('admin_notes', e.target.value)}
                    placeholder="Enter admin notes"
                    rows={3}
                  />
                </div>

                <Button onClick={handleStatusUpdate} className="w-full">
                  Update Order
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-6">
          <Button
            className="flex items-center gap-2 rounded-md bg-blue-600 px-5 py-2 font-semibold text-white shadow-md transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:outline-none active:bg-blue-800"
            onClick={handlePrint}
          >
            <Printer className="h-4 w-4" />
            Print Invoice
          </Button>
          <div style={{ display: 'none' }}>
            {/* <OrderInvoice ref={contentRef} order={order} /> */}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
