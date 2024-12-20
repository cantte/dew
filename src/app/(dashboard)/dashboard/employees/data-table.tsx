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
import type { Employee } from '~/app/(dashboard)/dashboard/employees/columns'
import { EmployeesDataTableToolbar } from '~/app/(dashboard)/dashboard/employees/data-table-toolbar'
import DataTable from '~/components/data-table'
import DataTablePagination from '~/components/data-table-pagination'
import { api } from '~/trpc/react'

type Props<TValue> = {
  columns: ColumnDef<Employee, TValue>[]
  data: Employee[]
  storeId: string
}

const EmployeeDataTable = <TValue,>({
  columns,
  data,
  storeId,
}: Props<TValue>) => {
  const { data: employees } = api.employee.byStore.useQuery(
    {
      storeId: storeId,
    },
    {
      initialData: data,
    },
  )

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const table = useReactTable<Employee>({
    data: employees,
    columns,
    state: {
      columnFilters,
      columnVisibility,
    },
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
  })

  return (
    <div className="grid grid-cols-1 gap-2">
      <EmployeesDataTableToolbar table={table} />
      <DataTable table={table} />
      <DataTablePagination table={table} />
    </div>
  )
}

export default EmployeeDataTable
