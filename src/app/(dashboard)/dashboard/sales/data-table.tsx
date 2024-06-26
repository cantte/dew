'use client'

import {
  type ColumnDef,
  type ColumnFiltersState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useState } from 'react'
import type { Sale } from '~/app/(dashboard)/dashboard/sales/columns'
import SalesDataTableToolbar from '~/app/(dashboard)/dashboard/sales/data-table-toolbar'
import DataTable from '~/components/data-table'
import DataTablePagination from '~/components/data-table-pagination'
import { api } from '~/trpc/react'

type Props<TValue> = {
  columns: ColumnDef<Sale, TValue>[]
  data: Sale[]
  storeId: string
}

const SalesDataTable = <TValue,>({ columns, data, storeId }: Props<TValue>) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const { data: sales } = api.sale.list.useQuery(
    { storeId: storeId },
    {
      initialData: data,
    },
  )

  const table = useReactTable<Sale>({
    data: sales,
    columns,
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <div className="space-y-2">
      <SalesDataTableToolbar table={table} />
      <DataTable table={table} />
      <DataTablePagination table={table} />
    </div>
  )
}

export default SalesDataTable
