import { RotateCw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import ConfirmDialog from '~/components/confirm-dialog'
import { Button } from '~/components/ui/button'
import { orderStatus } from '~/constants'
import { api } from '~/trpc/react'
import type { RouterOutputs } from '~/trpc/shared'

type Props = {
  order: NonNullable<RouterOutputs['order']['find']>
}

export const MoveOrderStatus = ({ order }: Props) => {
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
    </>
  )
}
