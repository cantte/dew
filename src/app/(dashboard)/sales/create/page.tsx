import CreateSaleForm from '~/app/(dashboard)/sales/create/form'
import BackButton from '~/components/back-button'
import NotEnoughPermissions from '~/components/not-enough-permissions'
import NotFoundStoreAlert from '~/components/stores/not-found.alert'
import { api } from '~/trpc/server'

const CreateSalePage = async () => {
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

  const products = await api.product.list({
    storeId: store.id,
  })

  return (
    <div className="flex w-full flex-col items-start space-y-4">
      <BackButton />

      <CreateSaleForm
        store={store}
        products={products}
        suggestions={suggestions}
      />
    </div>
  )
}

export default CreateSalePage
