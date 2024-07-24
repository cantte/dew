import { redirect } from 'next/navigation'
import { CreateProductForm } from '~/app/(dashboard)/dashboard/products/create/form'
import BackButton from '~/components/back-button'
import NotEnoughPermissions from '~/components/not-enough-permissions'
import NotFoundStoreAlert from '~/components/stores/not-found.alert'
import { getServerAuthSession } from '~/server/auth'
import { api } from '~/trpc/server'

const CreateProductPage = async () => {
  const session = await getServerAuthSession()

  if (!session) {
    return redirect('/api/auth/signin')
  }

  const store = await api.store.findCurrent()

  if (!store) {
    return <NotFoundStoreAlert />
  }

  const hasPermissions = await api.rbac.checkPermissions({
    permissions: ['product:create'],
  })

  if (!hasPermissions) {
    return <NotEnoughPermissions />
  }

  const units = await api.product.units()

  return (
    <div className="flex flex-col items-start space-y-4">
      <BackButton />

      <CreateProductForm store={store} units={units} />
    </div>
  )
}

export default CreateProductPage
