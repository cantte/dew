'use client'

import {
  type ColumnDef,
  getCoreRowModel,
  getFacetedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { type Store } from '~/app/(dashboard)/dashboard/stores/columns'
import DataTable from '~/components/data-table'
import DataTablePagination from '~/components/data-table-pagination'
import { api } from '~/trpc/react'

type Props<TValue> = {
  columns: ColumnDef<Store, TValue>[]
  data: Store[]
}

const StoreDataTable = <TValue,>({ columns, data }: Props<TValue>) => {
  const { data: stores } = api.store.list.useQuery(undefined, {
    initialData: data,
  })

  const table = useReactTable<Store>({
    data: stores,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
  })

  return (
    <div className="space-y-4">
      <DataTable table={table} />
      <DataTablePagination table={table} />
    </div>
  )
}

export default StoreDataTable
