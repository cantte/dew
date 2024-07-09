import { notFound } from 'next/navigation'
import BackButton from '~/components/back-button'
import NotEnoughPermissions from '~/components/not-enough-permissions'
import OrderDetail from '~/components/orders/detail'
import { api } from '~/trpc/server'

type Props = {
  params: {
    id: string
  }
}

export const dynamic = 'force-dynamic'

const OrderDetailPage = async ({ params }: Props) => {
  const hasPermissions = await api.rbac.checkPermissions({
    permissions: ['order:view'],
  })

  if (!hasPermissions) {
    return <NotEnoughPermissions />
  }

  const order = await api.order.find({ id: params.id })

  if (!order) {
    return notFound()
  }

  const canUpdate = await api.rbac.checkPermissions({
    permissions: ['order:update'],
  })

  return (
    <div className="flex flex-col items-start space-y-4">
      <BackButton />

      <OrderDetail order={order} canUpdate={canUpdate} />
    </div>
  )
}

export default OrderDetailPage
