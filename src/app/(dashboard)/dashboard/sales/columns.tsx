'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { ArrowLeftRightIcon, BanknoteIcon, CreditCardIcon } from 'lucide-react'
import type { DateRange } from 'react-day-picker'
import { SaleRowActions } from '~/app/(dashboard)/dashboard/sales/row-actions'
import { DataTableColumnHeader } from '~/components/data-table-column-header'
import { Badge } from '~/components/ui/badge'
import { paymentMethods, saleStatuses } from '~/constants'
import type { RouterOutputs } from '~/trpc/shared'

export type Sale = RouterOutputs['sale']['list'][number]

export const columns: ColumnDef<Sale>[] = [
  {
    id: 'Cliente',
    accessorKey: 'customer',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cliente" />
    ),
    cell: ({ row }) => {
      return <span>{row.original.customer}</span>
    },
    filterFn: (rows, id, value: string) => {
      const customer = rows.original.customer

      return customer.toLocaleUpperCase().includes(value.toLocaleUpperCase())
    },
  },
  {
    id: 'Total',
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total" />
    ),
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
    id: 'Estado',
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Estado"
        className="text-xs"
      />
    ),
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
    enableSorting: false,
  },
  {
    id: 'Método de pago',
    accessorKey: 'paymentMethod',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Método de pago"
        className="text-xs"
      />
    ),
    cell: ({ row }) => {
      let icon = <CreditCardIcon className="size-4 text-muted-foreground" />

      if (row.original.paymentMethod === 'cash') {
        icon = <BanknoteIcon className="size-4 text-muted-foreground" />
      }

      if (row.original.paymentMethod === 'transfer') {
        icon = <ArrowLeftRightIcon className="size-4 text-muted-foreground" />
      }

      return (
        <div className="flex items-center space-x-2">
          {icon}
          <span>
            {paymentMethods.find(
              (method) => method.id === row.original.paymentMethod,
            )?.label ?? 'Desconocido'}
          </span>
        </div>
      )
    },
    filterFn: (row, id, value: string) => {
      return value.includes(row.getValue(id))
    },
    enableSorting: false,
  },
  {
    id: 'Fecha',
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha" />
    ),
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
