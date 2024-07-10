import { useEffect, useState } from 'react'
import type { Store } from '~/app/(dashboard)/dashboard/stores/columns'
import ConfirmDialog from '~/components/confirm-dialog'
import { DropdownMenuItem } from '~/components/ui/dropdown-menu'
import { api } from '~/trpc/react'

type Props = {
  store: Store
}

export const DeleteStoreDialog = ({ store }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  const deleteStore = api.store.delete.useMutation()

  const handleDelete = () => {
    deleteStore.mutate({
      id: store.id,
    })
  }

  const utils = api.useUtils()

  // biome-ignore lint/correctness/useExhaustiveDependencies: not needed
  useEffect(() => {
    if (deleteStore.isSuccess) {
      void utils.store.list.invalidate()
      void utils.store.findCurrent.invalidate()
      setIsOpen(false)
    }
  }, [deleteStore.isSuccess])

  return (
    <>
      <DropdownMenuItem
        onSelect={(e) => e.preventDefault()}
        onClick={() => setIsOpen(true)}
      >
        Eliminar
      </DropdownMenuItem>

      <ConfirmDialog
        title="Eliminar tienda"
        description="¿Estás seguro que deseas eliminar esta tienda?"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDelete}
        pending={deleteStore.isPending}
      />
    </>
  )
}
