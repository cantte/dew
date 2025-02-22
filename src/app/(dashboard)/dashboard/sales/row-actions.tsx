'use client'

import type { Row } from '@tanstack/react-table'
import { Ellipsis } from 'lucide-react'
import Link from 'next/link'
import type { Sale } from '~/app/(dashboard)/dashboard/sales/columns'
import { ConfirmCancelSaleDialog } from '~/components/sales/confirm-cancel.dialog'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'

type Props = {
  row: Row<Sale>
}

export const SaleRowActions = ({ row }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <Ellipsis className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/sales/${row.original.code}`}>
            Ver detalles
          </Link>
        </DropdownMenuItem>

        {row.original.cancelable && (
          <ConfirmCancelSaleDialog sale={row.original} />
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
