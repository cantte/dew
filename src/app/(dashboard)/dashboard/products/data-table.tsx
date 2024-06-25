'use client'

import {
  type ColumnDef,
  type ColumnFiltersState,
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

type ProductDataTableProps<TValue> = {
  columns: ColumnDef<Product, TValue>[]
  data: Product[]
  storeId: string
}

const ProductDataTable = <TValue,>({
  columns,
  data,
  storeId,
}: ProductDataTableProps<TValue>) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const { data: products } = api.product.list.useQuery(
    { storeId: storeId },
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
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
  })

  return (
    <div className="space-y-2">
      <ProductsDataTableToolbar table={table} />
      <DataTable table={table} />
      <DataTablePagination table={table} />
    </div>
  )
}

export default ProductDataTable
