import OrderTable from '@/components/DataTables/OrderTable'
import AppLayout from '@/layouts/app-layout'
import { Head, router, usePage } from '@inertiajs/react'
import { Package2Icon } from 'lucide-react'

export default function OrderIndex() {
  const { orders, filters, statuses, paymentStatuses, can } = usePage().props

  const columns = [
    {
      key: 'index',
      label: '#',
      sortable: false,
      type: 'IndexColumn',
      width: '80px',
      render: (item: any, index: number) => {
        return (filters.page - 1) * filters.perPage + index + 1
      },
    },
    { key: 'order_number', label: 'Order Number', sortable: true },
    { key: 'customer_name', label: 'Customer Name', sortable: false },
    { key: 'customer_email', label: 'Customer Email', sortable: false },
    { key: 'total_price', type: 'price', label: 'Total Amount', sortable: true },
    { key: 'status', type: 'badge', label: 'Status', sortable: true },
    { key: 'payment_status', type: 'badge', label: 'Payment Status', sortable: true },
    { key: 'payment_method', label: 'Payment Method', sortable: false },
    { key: 'items_count', label: 'Items', sortable: false },
    { key: 'created_at', label: 'Order Date', sortable: true },
  ]

  const handleDelete = (id: string) => {
    router.delete(route('admin.orders.destroy', id), {
      preserveScroll: true,
      onSuccess: () => {
        // toast.success('Order deleted successfully');
      },
      onError: () => {
        // toast.error('Order deletion failed');
      },
    })
  }

  return (
    <AppLayout>
      <Head title="Orders" />
      <div className="py-6">
        <div className="mx-auto">
          <OrderTable
            data={orders}
            columns={columns}
            resourceName="Orders"
            singularName="Order"
            routeName="admin.orders.index"
            filters={filters}
            canViewResource={true}
            canCreateResource={can.create}
            canEditResource={can.edit}
            canDeleteResource={can.delete}
            createRoute=""
            viewRoute="admin.orders.show"
            editRoute=""
            onDelete={handleDelete}
            icon={Package2Icon}
            additionalFilters={{
              status: {
                label: 'Status',
                options: Object.entries(statuses).map(([value, label]) => ({ value, label })),
                value: filters.status,
              },
              payment_status: {
                label: 'Payment Status',
                options: Object.entries(paymentStatuses).map(([value, label]) => ({
                  value,
                  label,
                })),
                value: filters.payment_status,
              },
            }}
          />
        </div>
      </div>
    </AppLayout>
  )
}
