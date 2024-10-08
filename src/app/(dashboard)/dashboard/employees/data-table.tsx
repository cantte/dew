'use client'

import {
  type ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { Employee } from '~/app/(dashboard)/dashboard/employees/columns'
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
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="grid grid-cols-1 gap-2">
      <DataTable table={table} />
      <DataTablePagination table={table} />
    </div>
  )
}

export default EmployeeDataTable
