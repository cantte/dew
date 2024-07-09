import { notFound } from 'next/navigation'
import OrderDetail from '~/components/orders/detail'
import { api } from '~/trpc/server'

type Props = {
  params: {
    id: string
  }
}

export default async function OrderDetailPage({ params }: Props) {
  const order = await api.order.findPublic({ id: params.id })

  if (!order) {
    return notFound()
  }

  return (
    <div className="grid w-full max-w-7xl">
      <OrderDetail order={order} canUpdate={false} />
    </div>
  )
}
