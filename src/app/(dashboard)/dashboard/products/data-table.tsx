'use client'

import {
  type ColumnDef,
  type ColumnFiltersState,
  type VisibilityState,
  getCoreRowModel,
  getFacetedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useState } from 'react'
import type { Product } from '~/app/(dashboard)/dashboard/products/columns'
import ProductsDataTableToolbar from '~/app/(dashboard)/dashboard/products/data-table-toolbar'
import DataTable from '~/components/data-table'
import DataTablePagination from '~/components/data-table-pagination'
import { api } from '~/trpc/react'
import type { RouterOutputs } from '~/trpc/shared'

type Props<TValue> = {
  columns: ColumnDef<Product, TValue>[]
  data: Product[]
  store: NonNullable<RouterOutputs['store']['findCurrent']>
}

const ProductDataTable = <TValue,>({ columns, data, store }: Props<TValue>) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    isLowStock: false,
  })
  const [globalFilter, setGlobalFilter] = useState('')

  const { data: products } = api.product.list.useQuery(
    { storeId: store.id },
    {
      initialData: data,
    },
  )

  const table = useReactTable<Product>({
    data: products,
    columns,
    state: {
      columnFilters,
      globalFilter,
      columnVisibility,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
  })

  return (
    <div className="grid grid-cols-1 gap-4">
      <ProductsDataTableToolbar table={table} store={store} />
      <DataTable table={table} />
      <DataTablePagination table={table} />
    </div>
  )
}

export default ProductDataTable
