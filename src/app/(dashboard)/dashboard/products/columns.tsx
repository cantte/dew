'use client'

import type { ColumnDef } from '@tanstack/react-table'
import DataTableRowActions from '~/app/(dashboard)/dashboard/products/data-table-row-actions'
import { DataTableColumnHeader } from '~/components/data-table-column-header'
import { Badge } from '~/components/ui/badge'
import type { RouterOutputs } from '~/trpc/shared'

export type Product = RouterOutputs['product']['list'][number]

export const columns: ColumnDef<Product>[] = [
  {
    id: 'Código',
    accessorKey: 'code',
    header: 'Código',
    enableSorting: false,
    enableHiding: false,
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
          {row.original.isLowStock && (
            <Badge variant="destructive">Bajo stock</Badge>
          )}
        </div>
      )
    },
  },
  {
    id: 'Precio de compra',
    accessorKey: 'purchasePrice',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Precio de compra" />
    ),
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
    id: 'Precio de venta',
    accessorKey: 'salePrice',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Precio de venta" />
    ),
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
    id: 'Stock',
    accessorKey: 'stock',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stock" />
    ),
    cell: ({ row }) => {
      return (
        <span>{Intl.NumberFormat('es-CO').format(row.original.stock)}</span>
      )
    },
  },
  {
    id: 'Cantidad',
    accessorKey: 'quantity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cantidad" />
    ),
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
    enableSorting: false,
    enableHiding: false,
  },
]
