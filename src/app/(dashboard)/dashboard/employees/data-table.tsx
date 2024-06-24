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
import { type Employee } from '~/app/(dashboard)/dashboard/employees/columns'
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

  const table = useReactTable<Employee>({
    data: employees,
    columns,
    state: {
      columnFilters: [],
    },
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

export default EmployeeDataTable
