import type { Row } from '@tanstack/react-table'
import { EllipsisVertical } from 'lucide-react'
import type { Store } from '~/app/(dashboard)/dashboard/stores/columns'
import { DeleteStoreDialog } from '~/components/stores/delete-store.dialog'
import UpdateStoreModal from '~/components/stores/update-store.modal'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { api } from '~/trpc/react'

type Props = {
  row: Row<Store>
}

export const StoreDataTableRowActions = ({ row }: Props) => {
  const canEditStore = api.rbac.checkPermissions.useQuery({
    permissions: ['store:update'],
  })

  const canDeleteStore = api.rbac.checkPermissions.useQuery({
    permissions: ['store:delete'],
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <EllipsisVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[150px]">
        {canEditStore && <UpdateStoreModal store={row.original} />}

        {canDeleteStore && <DeleteStoreDialog store={row.original} />}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
