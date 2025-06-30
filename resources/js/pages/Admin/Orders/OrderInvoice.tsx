import { forwardRef } from 'react'

const OrderInvoice = forwardRef(({ order }, ref) => {
  // Helper for formatting
  const formatPrice = (price) => {
    const formatted = Number(price).toFixed(2)
    return <span className="font-mono text-base font-bold">{formatted} USD</span>
  }

  return (
    <div
      ref={ref}
      style={{
        width: 350,
        padding: 15,
        fontFamily: 'monospace',
        background: '#fff',
        color: '#000',
        fontSize: '13px',
      }}
    >
      {/* Header Section */}
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <div className="text-xs">******************************</div>
        <div className="text-xs">Your Company Name</div>
        <div className="text-xs">E-commerce Store</div>
        <div className="text-xs">******************************</div>
        <div style={{ fontWeight: 'bold', fontSize: 16, margin: '6px 0' }}>{t('Invoice')}</div>
        <div style={{ fontWeight: 'bold', fontSize: 18 }}>
          {t('Order №')} {order.order_number}
        </div>
      </div>

      {/* Company Info */}
      <div className="mb-2 text-xs">
        Your Company Name
        <br />
        E-commerce Store
        <br />
        +1 (555) 123-4567
        <br />
        {t('Address')}: 123 Main St, City, State 12345
      </div>

      {/* Order Info */}
      <div className="mb-2 text-xs">
        {t('Order Date')}: {new Date(order.created_at).toLocaleDateString()}
        <br />
        {t('Invoice Date')}: {new Date(order.created_at).toLocaleDateString()}
        <br />
        {t('Time')}: {new Date(order.created_at).toLocaleTimeString()}
        <br />
        {t('Payment Method')}: {order.payment_method}
        <br />
        {t('Payment Status')}: {order.payment_status}
      </div>

      {/* Customer Info */}
      <div className="mb-2 text-xs">
        <div style={{ fontWeight: 'bold' }}>{t('Bill To')}:</div>
        {order.billing_full_name}
        <br />
        {order.billing_email}
        <br />
        {order.billing_phone}
        <br />
        {order.billing_address}
        <br />
        {order.billing_city}, {order.billing_state} {order.billing_zip}
        <br />
        {order.billing_country}
      </div>

      {/* Shipping Info (if different from billing) */}
      {!order.is_shipping_same_as_billing && (
        <div className="mb-2 text-xs">
          <div style={{ fontWeight: 'bold' }}>{t('Ship To')}:</div>
          {order.shipping_full_name}
          <br />
          {order.shipping_address}
          <br />
          {order.shipping_city}, {order.shipping_state} {order.shipping_zip}
          <br />
          {order.shipping_country}
        </div>
      )}

      {/* Items Section */}
      <div className="text-xs">----------------------------------------</div>
      <div className="mb-1 text-xs font-bold">
        {t('Name')} {t('Qty')} {t('Price')} {t('Sum')}
      </div>
      <div className="mb-2">
        {order.order_items.map((item) => (
          <div key={item.id} className="mb-1">
            <div className="text-xs font-medium">{item.product_name}</div>
            {item.product_sku && (
              <div className="text-xs text-gray-600">SKU: {item.product_sku}</div>
            )}
            <div className="flex items-center justify-between text-xs">
              <span>
                {item.quantity} {t('pcs')} x {formatPrice(item.unit_price)}
              </span>
              <span className="font-bold">{formatPrice(item.total_price)}</span>
            </div>
            {item.variation_data && item.variation_data.length > 0 && (
              <div className="text-xs text-gray-600">
                {item.variation_data.map((variation, index) => (
                  <div key={index}>
                    {variation.type}: {variation.value}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Total Section */}
      <div className="my-2 border-t border-dashed border-gray-300"></div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span>{t('Subtotal')}:</span>
        {formatPrice(order.subtotal)}
      </div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span>{t('Tax')}:</span>
        {formatPrice(order.tax_amount)}
      </div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span>{t('Shipping')}:</span>
        {formatPrice(order.shipping_amount)}
      </div>
      {order.discount_amount > 0 && (
        <div className="mb-1 flex items-center justify-between text-xs text-red-600">
          <span>{t('Discount')}:</span>-{formatPrice(order.discount_amount)}
        </div>
      )}
      <div className="mb-2 flex items-center justify-between text-sm font-bold">
        <span>{t('TOTAL TO PAY')}:</span>
        {formatPrice(order.total_price)}
      </div>

      {/* Notes Section */}
      {order.customer_notes && (
        <div className="mb-2 text-xs">
          {t('Customer Notes')}:<br />
          {order.customer_notes}
        </div>
      )}

      {/* Footer Section */}
      <div style={{ textAlign: 'center', margin: '10px 0' }}>
        <div className="mt-1 text-xs text-gray-600">{t('All amounts in USD')}</div>
        <div className="mt-1 text-xs font-bold">{t('THANK YOU FOR YOUR ORDER!')}</div>
        <div className="mt-1 text-xs">
          <a
            href="https://yourstore.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            www.yourstore.com
          </a>
        </div>
      </div>
    </div>
  )
})

OrderInvoice.displayName = 'OrderInvoice'

export default OrderInvoice
