import { Link, router, usePage } from '@inertiajs/react'
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { useState } from 'react'
import DeleteDialog from '../DeleteDialog'
interface TableColumn {
  key: string
  label: string
  type?: 'text' | 'number' | 'date' | 'custom'
  sortable?: boolean
  render?: (row: any) => React.ReactNode
}

export default function SpecializationTable({
  data,
  columns = [],
  resourceName = '',
  singularName = '',
  routeName = '',
  filters = {},
  viewRoute = '',
  canViewResource = false,
  canCreateResource = false,
  canEditResource = false,
  canDeleteResource = false,
  icon: Icon,
  createRoute = '',
  editRoute = '',
  onDelete,
}: {
  data: any
  columns: any
  resourceName: string
  singularName: string
  routeName: string
  filters: any
  viewRoute: string
  canViewResource: boolean
  canCreateResource: boolean
  canEditResource: boolean
  canDeleteResource: boolean
  icon: React.ElementType
  createRoute: string
  editRoute: string
  onDelete: (id: string) => void
}) {
  const { errors, specialists } = usePage().props

  const [search, setSearch] = useState(filters?.search || '')
  const [perPage, setPerPage] = useState(filters?.perPage || 10)
  const [sort, setSort] = useState(filters?.sort || 'id')
  const [direction, setDirection] = useState(filters?.direction || 'desc')

  const [itemToDelete, setItemToDelete] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const updateRoute = (newParams = {}) => {
    const params = {
      search,
      perPage,
      sort,
      direction,
      page: 1,
      ...newParams,
    }

    router.get(route(routeName), params, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  const handleSearch = (e: any) => {
    e.preventDefault()
    updateRoute()
  }

  const handlePerPageChange = (e: any) => {
    const newPerPage = e.target.value
    setPerPage(newPerPage)
    updateRoute({ perPage: newPerPage })
  }

  const handleStatusSelect = (e: any) => {
    const newStatus = e.target.value
    updateRoute({ status: newStatus })
  }

  const handleSort = (column: any) => {
    const newDirection = sort === column && direction === 'asc' ? 'desc' : 'asc'
    setSort(column)
    setDirection(newDirection)
    updateRoute({ sort: column, direction: newDirection })
  }

  const formatDate = (dateString: any) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const formatDate2 = (dateString: any) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0') // Month is zero-based
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const formatPrice = (price: any) => {
    const currency = 'COM'
    const numericPrice = Number(price)
    if (isNaN(numericPrice)) {
      return '0 ' + currency
    }
    if (numericPrice % 1 === 0) {
      return numericPrice + ' ' + currency
    }
    return numericPrice.toFixed(2) + ' ' + currency
  }

  const renderCell = (item: any, column: any, index: number) => {
    if (!column.key) return null

    const getValue = (obj: any, path: any) => {
      return path.split('.').reduce((acc: any, part: any) => acc && acc[part], obj)
    }

    const value = getValue(item, column.key)

    if (column.type === 'date' && value) {
      return formatDate(value)
    }
    if (column.type === 'date2' && value) {
      return formatDate2(value)
    }

    if (column.type === 'price' && value) {
      return formatPrice(value)
    }

    if (column.type === 'badge') {
      let badgeClass = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium '
      if (value === 'active') {
        badgeClass += 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      } else if (value === 'inactive') {
        badgeClass += 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      } else {
        badgeClass += 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      }
      return <span className={badgeClass}>{value.charAt(0).toUpperCase() + value.slice(1)}</span>
    }
    if (column.type === 'image' && column.design === 'rec') {
      return (
        <img
          src={value}
          alt={item.name}
          onError={(e) => {
            e.currentTarget.onerror = null
            e.currentTarget.src = '/images/default.svg'
          }}
          className="h-30 w-30"
        />
      )
    }

    if (column.type === 'image' && column.design === 'circle') {
      return (
        <img
          src={value}
          alt={item.name}
          onError={(e) => {
            e.currentTarget.onerror = null
            e.currentTarget.src = '/images/default.svg'
          }}
          className="h-10 w-10 rounded-full"
        />
      )
    }
    if (column.type === 'boolean') {
      return value ? (
        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
          Yes
        </span>
      ) : (
        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-300">
          No
        </span>
      )
    }
    if (column.type === 'custom' && column.render) {
      return column.render(item)
    }

    if (column.type === 'IndexColumn' && column.render) {
      return column.render(item, index)
    }

    return value
  }

  const renderActions = (item: any) => {
    return (
      <div className="flex space-x-2">
        {canViewResource && (
          <button
            onClick={() => router.visit(route(viewRoute, item.id))}
            className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
          >
            View
          </button>
        )}

        {canDeleteResource && (
          <button
            onClick={() => {
              setItemToDelete(item)
              setShowDeleteDialog(true)
            }}
            className="rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-100 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800"
          >
            Delete
          </button>
        )}
      </div>
    )
  }

  let tableColumns: TableColumn[] = []

  tableColumns = [...columns]

  if (canEditResource || canDeleteResource || canViewResource) {
    tableColumns.push({
      key: 'actions',
      label: 'Actions',
      type: 'custom',
      sortable: false,
      render: renderActions,
    })
  }
  return (
    <div className="w-full bg-white dark:bg-gray-900">
      <div className="px-6 py-4">
        <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex items-center">
            {Icon && <Icon className="mr-3 h-6 w-6 text-blue-600 dark:text-blue-400" />}
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{resourceName}</h2>
          </div>
          {canCreateResource && (
            <Link
              href={route(createRoute)}
              className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              Add {singularName}
            </Link>
          )}
        </div>

        <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <form onSubmit={handleSearch} className="relative flex w-full max-w-md">
            <input
              type="text"
              placeholder={`Search ...`}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <button
              type="submit"
              className="ml-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:outline-none dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              Search
            </button>
          </form>

          <div className="mb-4 flex items-center space-x-4">
            <div>
              <label
                htmlFor="status"
                className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300"
              >
                Status:
              </label>
              <select
                id="status"
                className="w-40 rounded-lg border border-gray-300 bg-white py-2 pr-8 pl-3 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:focus:border-blue-400 dark:focus:ring-blue-800"
                value={filters.status}
                onChange={handleStatusSelect}
              >
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="preparing">Preparing</option>
                <option value="ready_for_pickup">Ready for Pickup</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="flex items-center">
            <label
              htmlFor="perPage"
              className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300"
            >
              Show
            </label>
            <select
              id="perPage"
              className="rounded-lg border border-gray-300 bg-white py-2 pr-8 pl-3 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              value={perPage}
              onChange={handlePerPageChange}
            >
              <option value="5">5 per page</option>
              <option value="10">10 per page</option>
              <option value="25">25 per page</option>
              <option value="50">50 per page</option>
              <option value="100">100 per page</option>
            </select>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-200 shadow dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                {tableColumns.map((column) => (
                  <th
                    key={column.key}
                    className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
                    style={column.width ? { width: column.width } : {}}
                  >
                    {column.sortable !== false ? (
                      <button
                        className="group inline-flex items-center"
                        onClick={() => handleSort(column.key)}
                      >
                        {column.label}
                        <span className="ml-2">
                          {sort === column.key ? (
                            direction === 'asc' ? (
                              <ArrowUp className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                            ) : (
                              <ArrowDown className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                            )
                          ) : (
                            <span className="opacity-0 group-hover:opacity-50">
                              <ArrowUp className="h-4 w-4" />
                            </span>
                          )}
                        </span>
                      </button>
                    ) : (
                      column.label
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.data.length > 0 ? (
                data.data.map((item: any, index: number) => (
                  <tr
                    key={item.id}
                    className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    {tableColumns.map((column) => (
                      <td
                        key={`${item.id}-${column.key}`}
                        className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-300"
                      >
                        {renderCell(item, column, index)}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={tableColumns.length}
                    className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex flex-col items-center justify-center">
                      {Icon && <Icon className="mb-2 h-10 w-10 text-gray-400 dark:text-gray-600" />}
                      <p className="font-medium">No {resourceName.toLowerCase()} Found</p>
                      <p className="mt-1 text-gray-400 dark:text-gray-500">
                        Try adjusting your search criteria
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination section */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing <span className="font-medium">{data.from || 0}</span> to{' '}
            <span className="font-medium">{data.to || 0}</span> of
            <span className="font-medium">{data.total}</span> results
          </p>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => data.prev_page_url && router.visit(data.prev_page_url)}
              disabled={!data.prev_page_url}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {data.links &&
              data.links.map((link: any, index: number) => {
                // Skip "prev" and "next" buttons
                if (link.label.includes('Previous') || link.label.includes('Next')) {
                  return null
                }

                // Try to parse the label as a number
                const pageNum = parseInt(link.label)
                if (isNaN(pageNum) && link.label.includes('...')) {
                  return (
                    <span
                      key={index}
                      className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      ...
                    </span>
                  )
                }

                return (
                  <button
                    key={index}
                    className={`relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${
                      link.active
                        ? 'bg-blue-600 text-white dark:bg-blue-700'
                        : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => router.visit(link.url)}
                    disabled={!link.url}
                  >
                    {pageNum || link.label}
                  </button>
                )
              })}

            <button
              onClick={() => data.next_page_url && router.visit(data.next_page_url)}
              disabled={!data.next_page_url}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <DeleteDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={() => onDelete(itemToDelete?.id)}
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
      />
    </div>
  )
}
