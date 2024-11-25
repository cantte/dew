'use client'

import { Fragment, useEffect, useState } from 'react'
import ConfirmDialog from '~/components/confirm-dialog'
import { DropdownMenuItem } from '~/components/ui/dropdown-menu'
import { api } from '~/trpc/react'
import type { RouterOutputs } from '~/trpc/shared'

type Props = {
  employee: RouterOutputs['employee']['byStore'][number]
}

export const DeleteEmployeeDialog = ({ employee }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const storeId = employee.storeId

  const deleteEmployee = api.store.deleteEmployee.useMutation()

  const handleDelete = () => {
    deleteEmployee.mutate({
      employeeId: employee.id,
      storeId,
    })
  }

  const utils = api.useUtils()

  // biome-ignore lint/correctness/useExhaustiveDependencies: not needed
  useEffect(() => {
    if (deleteEmployee.isSuccess) {
      utils.employee.byStore.invalidate({ storeId })
      setIsOpen(false)
    }
  }, [deleteEmployee.isSuccess])

  return (
    <Fragment>
      <DropdownMenuItem
        onSelect={(e) => e.preventDefault()}
        onClick={() => setIsOpen(true)}
      >
        Eliminar
      </DropdownMenuItem>

      <ConfirmDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDelete}
        title="Eliminar empleado"
        description="¿Estás seguro que deseas eliminar este empleado?"
      />
    </Fragment>
  )
}
