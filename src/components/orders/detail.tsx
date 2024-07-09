'use client'

import { useMutationState } from '@tanstack/react-query'
import { getQueryKey } from '@trpc/react-query'
import OrderHistoryDialog from '~/components/orders/history.dialog'
import { MoveOrderStatus } from '~/components/orders/move-status'
import { SaleOrderItems } from '~/components/sale-order-items'
import { Tooltip } from '~/components/tooltip'
import { Badge } from '~/components/ui/badge'
import { Separator } from '~/components/ui/separator'
import { orderStatus, paymentMethods } from '~/constants'
import {
  formatToCurrency,
  formatToDateWithTime,
  formatToNumber,
} from '~/text/format'
import { api } from '~/trpc/react'
import type { RouterOutputs } from '~/trpc/shared'

type Props = {
  order: NonNullable<RouterOutputs['order']['find']>
  canUpdate: boolean
}

const OrderDetail = ({ order, canUpdate: canUpdateOrder }: Props) => {
  const [moveToNextStatus] = useMutationState({
    filters: {
      mutationKey: getQueryKey(api.order.moveToNextStatus),
    },
  })

  const status = orderStatus.find((status) => status.id === order.status)

  return (
    <div className="flex min-h-[calc(100vh-20rem)] w-full flex-col space-y-4">
      <div className="flex items-center justify-start gap-2">
        <Tooltip title="Fecha de creación de la orden">
          <Badge variant="outline">
            {formatToDateWithTime('es-CO', order.createdAt)}
          </Badge>
        </Tooltip>

        {status && (
          <Badge
            variant={order.status === 'cancelled' ? 'destructive' : 'default'}
          >
            {status.label}
          </Badge>
        )}
      </div>
      <div className="grid grow grid-cols-1 gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <SaleOrderItems items={order.orderItems} />
        </div>

        <div className="flex flex-col justify-between gap-4 rounded border p-4">
          <div className="text-sm">
            <div className="grid gap-3">
              <div className="font-semibold">Resumen</div>
              <ul className="grid gap-3">
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Productos vendidos
                  </span>
                  <span>
                    {formatToNumber(
                      'es-CO',
                      order.orderItems.reduce(
                        (acc, item) => acc + item.quantity,
                        0,
                      ),
                    )}
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span>{formatToCurrency('es-CO', order.amount)}</span>
                </li>
              </ul>

              <Separator className="my-2" />

              <div className="font-semibold">Cliente</div>
              <p className="text-muted-foreground">
                {order.customer
                  ? `${order.customer.name} (${order.customer.id})`
                  : 'Mostrador'}
              </p>

              <Separator className="my-2" />

              <div className="space-y-2">
                <div className="font-semibold">Método de pago</div>
                <p className="text-muted-foreground">
                  {paymentMethods.find(
                    (method) => method.id === order.paymentMethod,
                  )?.label ?? 'Desconocido'}
                </p>
              </div>

              <ul className="grid gap-3">
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total a pagar</span>
                  <span>{formatToCurrency('es-CO', order.amount)}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Pago recibido</span>
                  <span>{formatToCurrency('es-CO', order.payment)}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Cambio</span>
                  <span>
                    {formatToCurrency('es-CO', order.payment - order.amount)}
                  </span>
                </li>
              </ul>

              <Separator className="my-2" />

              <div className="font-semibold">Datos de entrega</div>

              <ul className="grid gap-3">
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Dirección</span>
                  <span>{order.address}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Teléfono</span>
                  <span>{order.phone}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <OrderHistoryDialog
              order={order}
              disabled={moveToNextStatus?.status === 'pending'}
            />

            {canUpdateOrder && <MoveOrderStatus order={order} />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail
