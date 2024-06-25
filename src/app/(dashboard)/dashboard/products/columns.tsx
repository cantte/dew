'use client'

import type { ColumnDef } from '@tanstack/react-table'
import DataTableRowActions from '~/app/(dashboard)/dashboard/products/data-table-row-actions'
import { Badge } from '~/components/ui/badge'
import type { RouterOutputs } from '~/trpc/shared'

export type Product = RouterOutputs['product']['list'][number]

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'code',
    header: 'Código',
  },
  {
    accessorKey: 'name',
    header: 'Nombre',
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-2">
          <span>{row.original.name}</span>
          {row.original.isLowStock && (
            <Badge variant="destructive">Bajo stock</Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'purchasePrice',
    header: 'Precio de compra',
    cell: ({ row }) => {
      return (
        <span>
          {Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
          }).format(row.original.purchasePrice)}
        </span>
      )
    },
  },
  {
    accessorKey: 'salePrice',
    header: 'Precio de venta',
    cell: ({ row }) => {
      return (
        <span>
          {Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
          }).format(row.original.salePrice)}
        </span>
      )
    },
  },
  {
    accessorKey: 'stock',
    header: 'Stock',
    cell: ({ row }) => {
      return (
        <span>{Intl.NumberFormat('es-CO').format(row.original.stock)}</span>
      )
    },
  },
  {
    accessorKey: 'quantity',
    header: 'Cantidad',
    cell: ({ row }) => {
      return (
        <span>{Intl.NumberFormat('es-CO').format(row.original.quantity)}</span>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return <DataTableRowActions row={row} />
    },
  },
  {
    id: 'isLowStock',
    accessorKey: 'isLowStock',
  },
]
