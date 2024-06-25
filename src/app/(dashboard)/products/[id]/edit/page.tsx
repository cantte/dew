import { unstable_noStore as noStore } from 'next/cache'
import { notFound, redirect } from 'next/navigation'
import EditProductForm from '~/app/(dashboard)/products/[id]/edit/form'
import BackButton from '~/components/back-button'
import NotEnoughPermissions from '~/components/not-enough-permissions'
import { getServerAuthSession } from '~/server/auth'
import { api } from '~/trpc/server'

type Props = {
  params: {
    id: string
  }
}

const EditProductPage = async ({ params }: Props) => {
  noStore()
  const session = await getServerAuthSession()

  if (session === null) {
    return redirect('/api/auth/signin')
  }

  const hasPermissions = await api.rbac.checkPermissions({
    permissions: ['product:update', 'product:view'],
  })

  if (!hasPermissions) {
    return <NotEnoughPermissions />
  }

  const product = await api.product.findById({
    id: params.id,
  })

  if (product === null || product === undefined) {
    return notFound()
  }

  return (
    <div className="w-full max-w-7xl">
      <div className="mb-4 mt-4 md:mt-0">
        <BackButton />
      </div>
      <section className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Editar producto</h1>
        <EditProductForm product={product} />
      </section>
    </div>
  )
}

export default EditProductPage
