import { Suspense } from 'react'
import { columns } from '~/app/(dashboard)/dashboard/products/columns'
import { CreateProductButton } from '~/app/(dashboard)/dashboard/products/create-button'
import ProductDataTable from '~/app/(dashboard)/dashboard/products/data-table'
import { InventoryAdjustmentButton } from '~/app/(dashboard)/dashboard/products/inventory-adjustment.button'
import {
  ProductsOverview,
  ProductsOverviewFallback,
} from '~/app/(dashboard)/dashboard/products/overview'
import NotEnoughPermissions from '~/components/not-enough-permissions'
import NotFoundStoreAlert from '~/components/stores/not-found.alert'
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
      <Suspense fallback={<ProductsOverviewFallback />}>
        <ProductsOverview storeId={store.id} />
      </Suspense>

      <div className="flex gap-2">
        <CreateProductButton />

        <InventoryAdjustmentButton />
      </div>

      <ProductDataTable columns={columns} data={products} store={store} />
    </div>
  )
}

export default ProductsPage
