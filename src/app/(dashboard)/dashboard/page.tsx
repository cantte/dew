import CreateSaleForm from '~/app/(dashboard)/sales/create/form'
import NotEnoughPermissions from '~/components/not-enough-permissions'
import NotFoundStoreAlert from '~/components/stores/not-found.alert'
import { api } from '~/trpc/server'

export default async function DashboardPage() {
  const store = await api.store.findCurrent()
  if (!store) {
    return <NotFoundStoreAlert />
  }

  const hasPermissions = await api.rbac.checkPermissions({
    permissions: ['sale:create', 'product:view'],
  })

  if (!hasPermissions) {
    return <NotEnoughPermissions />
  }

  const suggestions = await api.product.suggestions({
    storeId: store.id,
  })

  const products = await api.product.forSale({
    storeId: store.id,
  })

  const employees = await api.employee.byStore({
    storeId: store.id,
  })

  return (
    <div className="flex w-full flex-col items-start space-y-4">
      <CreateSaleForm
        store={store}
        employees={employees}
        products={products}
        suggestions={suggestions}
      />
    </div>
  )
}
