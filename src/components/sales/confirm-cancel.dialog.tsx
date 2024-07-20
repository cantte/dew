'use client'

import { useEffect, useState } from 'react'
import ConfirmDialog from '~/components/confirm-dialog'
import { DropdownMenuItem } from '~/components/ui/dropdown-menu'
import { api } from '~/trpc/react'
import type { RouterOutputs } from '~/trpc/shared'

type Sale = RouterOutputs['sale']['list'][number]

type Props = {
  sale: Sale
}

export const ConfirmCancelSaleDialog = ({ sale }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  const cancelSale = api.sale.cancel.useMutation()

  const handleCancel = () => {
    cancelSale.mutate({
      code: sale.code,
    })
  }

  const utils = api.useUtils()
  // biome-ignore lint/correctness/useExhaustiveDependencies: not needed here
  useEffect(() => {
    if (cancelSale.isSuccess) {
      void utils.sale.list.invalidate()
      setIsOpen(false)
    }
  }, [cancelSale.isSuccess])

  return (
    <>
      <DropdownMenuItem
        onSelect={(e) => e.preventDefault()}
        onClick={() => setIsOpen(true)}
      >
        Cancelar
      </DropdownMenuItem>

      <ConfirmDialog
        isOpen={isOpen}
        title="Cancelar venta"
        description="¿Estás seguro que deseas cancelar la venta?"
        pending={cancelSale.isPending}
        onClose={() => setIsOpen(false)}
        onConfirm={handleCancel}
      />
    </>
  )
}
