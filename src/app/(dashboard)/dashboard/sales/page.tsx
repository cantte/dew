import { Suspense } from 'react'
import { columns } from '~/app/(dashboard)/dashboard/sales/columns'
import CreateSaleButton from '~/app/(dashboard)/dashboard/sales/create-button'
import SalesDataTable from '~/app/(dashboard)/dashboard/sales/data-table'
import NotEnoughPermissions from '~/components/not-enough-permissions'
import NotFoundStoreAlert from '~/components/stores/not-found.alert'
import { Skeleton } from '~/components/ui/skeleton'
import { api } from '~/trpc/server'

const SalesPage = async () => {
  const store = await api.store.findCurrent()

  if (store === undefined) {
    return <NotFoundStoreAlert />
  }

  const hasPermissions = await api.rbac.checkPermissions({
    permissions: ['sale:view'],
  })

  if (!hasPermissions) {
    return <NotEnoughPermissions />
  }

  const sales = await api.sale.list({
    storeId: store.id,
  })

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Suspense fallback={<Skeleton className="h-8 w-32" />}>
          <CreateSaleButton />
        </Suspense>
      </div>

      <SalesDataTable columns={columns} data={sales} storeId={store.id} />
    </div>
  )
}

export default SalesPage
