import { InventoryAdjustmentForm } from '~/app/(dashboard)/dashboard/inventory/adjustment/form'
import BackButton from '~/components/back-button'
import NotEnoughPermissions from '~/components/not-enough-permissions'
import NotFoundStoreAlert from '~/components/stores/not-found.alert'
import { api } from '~/trpc/server'

export default async function InventoryAdjustmentPage() {
  const store = await api.store.findCurrent()

  if (!store) {
    return <NotFoundStoreAlert />
  }

  const hasPermissions = await api.rbac.checkPermissions({
    permissions: ['inventory:update'],
  })

  if (!hasPermissions) {
    return <NotEnoughPermissions />
  }

  const products = await api.product.list({
    storeId: store.id,
  })

  return (
    <div className="flex flex-col items-start space-y-4">
      <BackButton />

      <InventoryAdjustmentForm store={store} products={products} />
    </div>
  )
}
