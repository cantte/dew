'use client'

import type { ColumnDef } from '@tanstack/react-table'
import OrderRowActions from '~/app/(dashboard)/dashboard/orders/row-actions'
import { Badge } from '~/components/ui/badge'
import { orderStatus } from '~/constants'
import { paymentMethods } from '~/server/api/schemas/sales'
import type { RouterOutputs } from '~/trpc/shared'

export type Order = RouterOutputs['order']['list'][number]

export const columns: ColumnDef<Order>[] = [
  {
    id: 'customer',
    header: 'Cliente',
    cell: ({ row }) => {
      return (
        <span>
          {row.original.customer.id}, {row.original.customer.name}
        </span>
      )
    },
  },
  {
    accessorKey: 'amount',
    header: 'Total',
    cell: ({ row }) => {
      return (
        <span>
          {Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
          }).format(row.original.amount)}
        </span>
      )
    },
  },
  {
    accessorKey: 'paymentMethod',
    header: 'Método de pago',
    cell: ({ row }) => {
      return (
        <span>
          {paymentMethods.find(
            (method) => method.value === row.original.paymentMethod,
          )?.label ?? 'Desconocido'}
        </span>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Fecha',
    cell: ({ row }) => {
      return (
        <span>
          {Intl.DateTimeFormat('es-CO', {
            dateStyle: 'short',
            timeStyle: 'short',
          }).format(row.original.createdAt)}
        </span>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => {
      const status = orderStatus.find(
        (status) => status.id === row.original.status,
      )

      return (
        <Badge
          variant={
            row.original.status === 'cancelled' ? 'destructive' : 'default'
          }
        >
          {status?.label ?? 'Desconocido'}
        </Badge>
      )
    },
    filterFn: (row, id, value: string) => {
      return value.includes(row.getValue(id))
    },
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
    id: 'actions',
    cell: ({ row }) => {
      return <OrderRowActions row={row} />
    },
  },
]
