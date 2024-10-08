import { Fragment, useEffect, useState } from 'react'
import ConfirmDialog from '~/components/confirm-dialog'
import { DropdownMenuItem } from '~/components/ui/dropdown-menu'
import { orderStatus } from '~/constants'
import { api } from '~/trpc/react'
import type { RouterOutputs } from '~/trpc/shared'

type Order = RouterOutputs['order']['list'][number]

type Props = {
  order: Order
}

const ConfirmMoveOrderStatusDialog = ({ order }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  const moveToNextStatus = api.order.moveToNextStatus.useMutation()

  const handleMove = () => {
    moveToNextStatus.mutate({
      id: order.id,
    })
  }

  const utils = api.useUtils()

  // biome-ignore lint/correctness/useExhaustiveDependencies: not needed
  useEffect(() => {
    if (moveToNextStatus.isSuccess) {
      utils.order.list.invalidate()
      setIsOpen(false)
    }
  }, [moveToNextStatus.isSuccess])

  const currentStatus = order.status
  const nextStatus = orderStatus.find((s) => s.id === currentStatus)?.next

  if (!nextStatus) {
    return null
  }

  const nextStatusLabel = orderStatus.find((s) => s.id === nextStatus)?.label

  return (
    <Fragment>
      <DropdownMenuItem
        onSelect={(e) => e.preventDefault()}
        onClick={() => setIsOpen(true)}
      >
        Mover al siguiente estado
      </DropdownMenuItem>

      <ConfirmDialog
        isOpen={isOpen}
        title="Mover orden a siguiente estado"
        description={`¿Estás seguro que deseas mover la orden a "${nextStatusLabel}"?`}
        pending={moveToNextStatus.isPending}
        onClose={() => setIsOpen(false)}
        onConfirm={handleMove}
      />
    </Fragment>
  )
}

export default ConfirmMoveOrderStatusDialog
