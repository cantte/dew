import { Fragment, useEffect, useState } from 'react'
import ConfirmDialog from '~/components/confirm-dialog'
import { DropdownMenuItem } from '~/components/ui/dropdown-menu'
import { api } from '~/trpc/react'
import type { RouterOutputs } from '~/trpc/shared'

type Order = RouterOutputs['order']['list'][number]

type Props = {
  order: Order
}

const ConfirmCancelOrderDialog = ({ order }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  const cancelOrder = api.order.cancel.useMutation()

  const handleCancel = () => {
    cancelOrder.mutate({
      id: order.id,
    })
  }

  const utils = api.useUtils()

  // biome-ignore lint/correctness/useExhaustiveDependencies: not needed
  useEffect(() => {
    if (cancelOrder.isSuccess) {
      utils.order.list.invalidate()
      setIsOpen(false)
    }
  }, [cancelOrder.isSuccess])

  return (
    <Fragment>
      <DropdownMenuItem
        onSelect={(e) => e.preventDefault()}
        onClick={() => setIsOpen(true)}
      >
        Cancelar
      </DropdownMenuItem>

      <ConfirmDialog
        isOpen={isOpen}
        title="Cancelar orden"
        description="¿Estás seguro que deseas cancelar la orden?"
        pending={cancelOrder.isPending}
        onClose={() => setIsOpen(false)}
        onConfirm={handleCancel}
      />
    </Fragment>
  )
}

export default ConfirmCancelOrderDialog
