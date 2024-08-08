'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { SquarePen } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import type { RouterOutputs } from '~/trpc/shared'

export type Employee = RouterOutputs['employee']['byStore'][number]

export const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: 'name',
    header: 'Nombre',
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
    accessorKey: 'email',
    header: 'Correo',
  },
  {
    accessorKey: 'phone',
    header: 'Teléfono',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <Button variant="secondary" size="icon" asChild>
          <Link href={`/dashboard/employees/${row.original.id}/edit`}>
            <SquarePen className="h-4 w-4" />
          </Link>
        </Button>
      )
    },
  },
]
