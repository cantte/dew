import { Skeleton } from '~/components/ui/skeleton'
import { getOrderStatusLabel } from '~/lib/utils'
import { api } from '~/trpc/react'

type Props = {
  orderId: string
}

const OrderHistory = ({ orderId }: Props) => {
  const { data: history, isPending } = api.order.history.useQuery({
    id: orderId,
  })

  return (
    <>
      {isPending && (
        <div className="flex flex-col space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      )}
      {history && (
        <div className="overflow-y-auto p-4">
          <ul className="relative grid gap-7 pl-6 after:absolute after:inset-y-0 after:left-0 after:w-px after:bg-border">
            {history.map((h) => (
              <li key={h.id} className="relative grid gap-1 text-sm">
                <div className="absolute left-0 top-1 z-10 aspect-square w-3 translate-x-[-29.5px] rounded-full bg-primary" />
                <div className="font-medium">
                  {getOrderStatusLabel(h.status)}
                </div>
                <div className="text-muted-foreground">
                  {Intl.DateTimeFormat('es-CO', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                  }).format(h.createdAt)}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}

export default OrderHistory
