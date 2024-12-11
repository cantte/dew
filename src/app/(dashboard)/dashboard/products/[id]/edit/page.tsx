import { unstable_noStore as noStore } from 'next/cache'
import { notFound } from 'next/navigation'
import { EditProductForm } from '~/app/(dashboard)/dashboard/products/[id]/edit/form'
import BackButton from '~/components/back-button'
import NotEnoughPermissions from '~/components/not-enough-permissions'
import { api } from '~/trpc/server'

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function EditProductPage(props: Readonly<Props>) {
  const params = await props.params
  noStore()

  const hasPermissions = await api.rbac.checkPermissions({
    permissions: ['product:update', 'product:view'],
  })

  if (!hasPermissions) {
    return <NotEnoughPermissions />
  }

  const product = await api.product.findById({
    id: params.id,
  })

  if (!product) {
    return notFound()
  }

  const units = await api.product.units()

  return (
    <div className="flex flex-col items-start space-y-4">
      <BackButton />

      <EditProductForm product={product} units={units} />
    </div>
  )
}
