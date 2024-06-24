'use client'

import { History } from 'lucide-react'
import { Suspense } from 'react'
import OrderHistory from '~/components/orders/history'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import type { RouterOutputs } from '~/trpc/shared'

type Props = {
  order: NonNullable<RouterOutputs['order']['find']>
  disabled: boolean
}

const OrderHistoryDialog = ({ order, disabled }: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full" disabled={disabled}>
          <History className="mr-2 h-4 w-4" />
          Ver historial
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Historial de la orden</DialogTitle>
        </DialogHeader>

        <Suspense fallback="Cargando historial...">
          <OrderHistory orderId={order.id} />
        </Suspense>
      </DialogContent>
    </Dialog>
  )
}

export default OrderHistoryDialog
