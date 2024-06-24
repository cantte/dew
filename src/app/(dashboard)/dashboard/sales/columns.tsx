'use client'

import { EyeOpenIcon } from '@radix-ui/react-icons'
import { type ColumnDef } from '@tanstack/react-table'
import NextLink from 'next/link'
import { type DateRange } from 'react-day-picker'
import { Button } from '~/components/ui/button'
import { paymentMethods } from '~/server/api/schemas/sales'
import { type RouterOutputs } from '~/trpc/shared'

export type Sale = RouterOutputs['sale']['list'][number]

export const columns: ColumnDef<Sale>[] = [
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
    filterFn: (rows, id, value: string) => {
      const customer = rows.original.customer

      return (
        customer.id.includes(value) ||
        customer.name.toLowerCase().includes(value.toLowerCase())
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
      return (
        <Button asChild size="icon" variant="ghost">
          <NextLink href={`/dashboard/sales/${row.original.code}`}>
            <EyeOpenIcon className="h-4 w-4" />
          </NextLink>
        </Button>
      )
    },
  },
]
