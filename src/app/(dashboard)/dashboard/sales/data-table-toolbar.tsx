'use client'

import { Cross2Icon } from '@radix-ui/react-icons'
import type { Table } from '@tanstack/react-table'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import DateRangeFilter from '~/app/(dashboard)/dashboard/sales/date-range-filter'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { api } from '~/trpc/react'

type DataTableToolbarProps<TData> = {
  table: Table<TData>
}

const SalesDataTableToolbar = <TData,>({
  table,
}: DataTableToolbarProps<TData>) => {
  const isFiltered = table.getState().columnFilters.length > 0

  const canCreateSale = api.rbac.checkPermissions.useQuery({
    permissions: ['sale:create'],
  })

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Buscar por cliente"
          value={
            (table.getColumn('customer')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('customer')?.setFilterValue(event.target.value)
          }
          className="w-[150px] lg:w-[250px]"
        />

        <DateRangeFilter table={table} className="border-dashed" />

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Limpiar filtros
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex space-x-2">
        {!canCreateSale.isPending && canCreateSale.data ? (
          <Button asChild size="sm" className="h-7 gap-1">
            <Link href="/sales/create">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Nueva venta
              </span>
            </Link>
          </Button>
        ) : null}
      </div>
    </div>
  )
}

export default SalesDataTableToolbar
