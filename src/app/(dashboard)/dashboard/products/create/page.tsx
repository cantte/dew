import { redirect } from 'next/navigation'
import CreateProductForm from '~/app/(dashboard)/dashboard/products/create/form'
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

  const stores = await api.store.list()

  return (
    <div className='flex w-full flex-col items-center'>
      <div className='space-y-4'>
        <BackButton />

        <section className="flex flex-col gap-4">
          <h1 className='font-bold text-xl'>Crear producto</h1>

          <CreateProductForm storeId={store.id} stores={stores} />
        </section>
      </div>
    </div>
  )
}

export default CreateProductPage
