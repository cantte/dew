'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { EmployeeDataTableRowActions } from '~/app/(dashboard)/dashboard/employees/data-table-row-actions'
import { DataTableColumnHeader } from '~/components/data-table-column-header'
import { Badge } from '~/components/ui/badge'
import type { RouterOutputs } from '~/trpc/shared'

export type Employee = RouterOutputs['employee']['byStore'][number]

export const columns: ColumnDef<Employee>[] = [
  {
    id: 'Identificación',
    accessorKey: 'code',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Identificación"
        className="text-xs"
      />
    ),
    enableSorting: false,
  },
  {
    id: 'Nombre',
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-2">
          <span>{row.original.name}</span>

          {row.original.isOwner && <Badge>Propietario</Badge>}
          {row.original.isCurrentEmployee && (
            <Badge variant="outline">Yo</Badge>
          )}
        </div>
      )
    },
  },
  {
    id: 'Correo',
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Correo" />
    ),
  },
  {
    id: 'Teléfono',
    accessorKey: 'phone',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Teléfono" />
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return <EmployeeDataTableRowActions row={row} />
    },
  },
]
