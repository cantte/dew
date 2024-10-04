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

  const hasPermissions = await api.rbac.checkPermissions({
    permissions: ['sale:create', 'product:view'],
  })

  if (!hasPermissions) {
    return <NotEnoughPermissions />
  }

  const trial = await api.subscription.trial()
  const subscription = await api.subscription.find()

  const hasSubscription = subscription !== undefined

  if (!hasSubscription && !trial.isActive) {
    return <NotActiveSubscription />
  }

  if (subscription?.status === 'past_due') {
    return <NotActiveSubscription />
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
