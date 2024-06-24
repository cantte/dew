import CreateOrderForm from '~/app/(dashboard)/orders/create/form'
import BackButton from '~/components/back-button'
import NotEnoughPermissions from '~/components/not-enough-permissions'
import NotFoundStoreAlert from '~/components/stores/not-found.alert'
import { api } from '~/trpc/server'

const CreateOrderPage = async () => {
  const store = await api.store.findCurrent()

  if (!store) {
    return <NotFoundStoreAlert />
  }

  const hasPermissions = await api.rbac.checkPermissions({
    permissions: ['order:create', 'product:view'],
  })

  if (!hasPermissions) {
    return <NotEnoughPermissions />
  }

  const suggestions = await api.product.suggestions({
    storeId: store.id,
  })

  return (
    <div className="w-full max-w-7xl">
      <div className="mb-4 mt-4 md:mt-0">
        <BackButton />
      </div>

      <section className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Crear orden</h1>

        <CreateOrderForm storeId={store.id} suggestions={suggestions} />
      </section>
    </div>
  )
}

export default CreateOrderPage
