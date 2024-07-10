'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { StoreDataTableRowActions } from '~/app/(dashboard)/dashboard/stores/data-table-row-actions'
import UpdateStoreModal from '~/components/stores/update-store.modal'
import type { RouterOutputs } from '~/trpc/shared'

export type Store = RouterOutputs['store']['list'][number]

export const columns: ColumnDef<Store>[] = [
  {
    accessorKey: 'name',
    header: 'Nombre',
  },
  {
    accessorKey: 'address',
    header: 'Dirección',
  },
  {
    accessorKey: 'phone',
    header: 'Teléfono',
  },
  {
    accessorKey: 'createdAt',
    header: 'Fecha de creación',
    cell: ({ row }) => {
      return (
        <span>
          {Intl.DateTimeFormat('es-CO', {
            dateStyle: 'short',
            timeStyle: 'short',
          }).format(new Date(row.original.createdAt))}
        </span>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return <StoreDataTableRowActions row={row} />
    },
  },
]
