'use client'

import type { ColumnDef } from '@tanstack/react-table'
import type { DateRange } from 'react-day-picker'
import { SaleRowActions } from '~/app/(dashboard)/dashboard/sales/row-actions'
import { Badge } from '~/components/ui/badge'
import { paymentMethods, saleStatuses } from '~/constants'
import type { RouterOutputs } from '~/trpc/shared'

export type Sale = RouterOutputs['sale']['list'][number]

export const columns: ColumnDef<Sale>[] = [
  {
    id: 'customer',
    header: 'Cliente',
    cell: ({ row }) => {
      return <span>{row.original.customer}</span>
    },
    filterFn: (rows, id, value: string) => {
      const customer = rows.original.customer

      return customer.toLocaleUpperCase().includes(value.toLocaleUpperCase())
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
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => {
      return (
        <Badge
          variant={
            row.original.status === 'paid'
              ? 'success'
              : row.original.status === 'cancelled'
                ? 'destructive'
                : 'default'
          }
        >
          {saleStatuses.find((status) => status.id === row.original.status)
            ?.label ?? 'Desconocido'}
        </Badge>
      )
    },
    filterFn: (row, id, value: string) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'paymentMethod',
    header: 'Método de pago',
    cell: ({ row }) => {
      return (
        <span>
          {paymentMethods.find(
            (method) => method.id === row.original.paymentMethod,
          )?.label ?? 'Desconocido'}
        </span>
      )
    },
    filterFn: (row, id, value: string) => {
      return value.includes(row.getValue(id))
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
          }).format(new Date(row.original.createdAt))}
        </span>
      )
    },
    filterFn: (rows, id, value: DateRange) => {
      const createdAt = rows.original.createdAt

      if (value.from === undefined) {
        return true
      }

      if (value.to === undefined) {
        return true
      }

      return (
        createdAt >= value.from &&
        createdAt <= new Date(value.to.getTime() + 86400000)
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return <SaleRowActions row={row} />
    },
  },
]
