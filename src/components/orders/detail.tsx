'use client'

import { RotateCw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import ConfirmDialog from '~/components/confirm-dialog'
import OrderHistoryDialog from '~/components/orders/history.dialog'
import { SaleOrderItems } from '~/components/sale-order-items'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { orderStatus, paymentMethods } from '~/constants'
import { api } from '~/trpc/react'
import type { RouterOutputs } from '~/trpc/shared'

type Props = {
  order: NonNullable<RouterOutputs['order']['find']>
}

const OrderDetail = ({ order }: Props) => {
  const [isOpenConfirmDialog, setIsOpenConfirmDialog] = useState(false)

  const moveToNextStatus = api.order.moveToNextStatus.useMutation()

  const handleMove = () => {
    moveToNextStatus.mutate({
      id: order.id,
    })
  }

  const utils = api.useUtils()
  const router = useRouter()

  // biome-ignore lint/correctness/useExhaustiveDependencies: no needed
  useEffect(() => {
    if (moveToNextStatus.isSuccess) {
      void utils.order.list.invalidate()
      setIsOpenConfirmDialog(false)
      router.refresh()
    }
  }, [moveToNextStatus.isSuccess])

  const currentStatus = order.status
  const nextStatus = orderStatus.find((s) => s.id === currentStatus)?.next
  const nextStatusLabel = orderStatus.find((s) => s.id === nextStatus)?.label

  return (
    <>
      <ConfirmDialog
        isOpen={isOpenConfirmDialog}
        title="Mover orden a siguiente estado"
        description={`¿Estás seguro que deseas mover la orden a "${nextStatusLabel}"?`}
        pending={moveToNextStatus.isPending}
        onClose={() => setIsOpenConfirmDialog(false)}
        onConfirm={handleMove}
      />

      <div className="flex min-h-[calc(100vh-20rem)] w-full flex-col space-y-4">
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
                      {Intl.NumberFormat('es-CO').format(
                        order.orderItems.reduce(
                          (acc, item) => acc + item.quantity,
                          0,
                        ),
                      )}
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total</span>
                    <span>
                      {Intl.NumberFormat('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                      }).format(order.amount)}
                    </span>
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
                    <span>
                      {Intl.NumberFormat('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                      }).format(order.amount)}
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Pago recibido</span>
                    <span>
                      {Intl.NumberFormat('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                      }).format(order.payment)}
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Cambio</span>
                    <span>
                      {Intl.NumberFormat('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                      }).format(order.payment - order.amount)}
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
                disabled={moveToNextStatus.isPending}
              />

              {order.status !== 'cancelled' && order.status !== 'delivered' && (
                <Button
                  className="w-full"
                  disabled={moveToNextStatus.isPending}
                  onClick={() => setIsOpenConfirmDialog(true)}
                >
                  {moveToNextStatus.isPending && (
                    <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Actualizar estado
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default OrderDetail
