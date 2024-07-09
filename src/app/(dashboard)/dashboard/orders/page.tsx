import { Suspense } from 'react'
import { columns } from '~/app/(dashboard)/dashboard/orders/columns'
import CreateOrderButton from '~/app/(dashboard)/dashboard/orders/create-button'
import OrdersDataTable from '~/app/(dashboard)/dashboard/orders/data-table'
import NotEnoughPermissions from '~/components/not-enough-permissions'
import OrdersOverview from '~/components/orders/overview'
import NotFoundStoreAlert from '~/components/stores/not-found.alert'
import { Skeleton } from '~/components/ui/skeleton'
import { api } from '~/trpc/server'

const OrdersPage = async () => {
  const store = await api.store.findCurrent()

  if (store === undefined) {
    return <NotFoundStoreAlert />
  }

  const hasPermissions = await api.rbac.checkPermissions({
    permissions: ['order:view'],
  })

  if (!hasPermissions) {
    return <NotEnoughPermissions />
  }

  const orders = await api.order.list({
    storeId: store.id,
  })

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Suspense fallback={<Skeleton className="h-5 w-full max-w-[450px]" />}>
          <OrdersOverview />
        </Suspense>

        <Suspense fallback={<Skeleton className="h-8 w-32" />}>
          <CreateOrderButton />
        </Suspense>
      </div>

      <OrdersDataTable columns={columns} data={orders} storeId={store.id} />
    </div>
  )
}

export default OrdersPage
