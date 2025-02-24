import CreateSaleForm from '~/app/(dashboard)/sales/create/form'
import BackButton from '~/components/back-button'
import { NotActiveSubscription } from '~/components/not-active-subscription'
import NotEnoughPermissions from '~/components/not-enough-permissions'
import NotFoundStoreAlert from '~/components/stores/not-found.alert'
import { api } from '~/trpc/server'

const CreateSalePage = async () => {
  const store = await api.store.findCurrent()

  if (!store) {
    return <NotFoundStoreAlert />
  }

  const trial = await api.subscription.trial()
  const subscription = await api.subscription.find()

  if (!subscription && !trial.isActive) {
    return <NotActiveSubscription />
  }

  if (!subscription) {
    return <NotActiveSubscription />
  }

  if (subscription.status === 'past_due') {
    return <NotActiveSubscription />
  }

  const today = new Date()
  if (subscription.status === 'inactive' && subscription.periodEnd < today) {
    return <NotActiveSubscription />
  }

  const hasPermissions = await api.rbac.checkPermissions({
    permissions: ['sale:create', 'product:view'],
  })

  if (!hasPermissions) {
    return <NotEnoughPermissions />
  }

  const [suggestions, products, employees] = await Promise.all([
    api.product.suggestions({ storeId: store.id }),
    api.product.forSale({ storeId: store.id }),
    api.employee.byStore({ storeId: store.id }),
  ])

  return (
    <div className="flex w-full flex-col items-start space-y-2">
      <BackButton />

      <CreateSaleForm
        store={store}
        employees={employees}
        products={products}
        suggestions={suggestions}
      />
    </div>
  )
}

export default CreateSalePage
