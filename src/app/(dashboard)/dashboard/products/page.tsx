import { Suspense } from 'react'
import { columns } from '~/app/(dashboard)/dashboard/products/columns'
import CreateProductButton from '~/app/(dashboard)/dashboard/products/create-button'
import ProductDataTable from '~/app/(dashboard)/dashboard/products/data-table'
import ProductsOverview from '~/app/(dashboard)/dashboard/products/overview'
import NotEnoughPermissions from '~/components/not-enough-permissions'
import NotFoundStoreAlert from '~/components/stores/not-found.alert'
import { Skeleton } from '~/components/ui/skeleton'
import { api } from '~/trpc/server'

const ProductsPage = async () => {
  const store = await api.store.findCurrent()

  if (!store) {
    return <NotFoundStoreAlert />
  }

  const hasPermissions = await api.rbac.checkPermissions({
    permissions: ['product:view'],
  })

  if (!hasPermissions) {
    return <NotEnoughPermissions />
  }

  const products = await api.product.list({
    storeId: store.id,
  })

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Suspense fallback={<Skeleton className="h-8 w-10" />}>
          <ProductsOverview storeId={store.id} />
        </Suspense>

        <Suspense fallback={<Skeleton className="h-8 w-10" />}>
          <CreateProductButton />
        </Suspense>
      </div>

      <ProductDataTable columns={columns} data={products} storeId={store.id} />
    </div>
  )
}

export default ProductsPage
