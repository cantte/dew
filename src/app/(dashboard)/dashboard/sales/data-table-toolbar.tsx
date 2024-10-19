'use client'

import type { Table } from '@tanstack/react-table'
import { mkConfig } from 'export-to-csv'
import { FileDown, FilterX } from 'lucide-react'
import { useMemo } from 'react'
import DateRangeFilter from '~/app/(dashboard)/dashboard/sales/date-range-filter'
import DataTableFacetedFilter from '~/components/data-table-faceted-filter'
import { Button } from '~/components/ui/button'
import { paymentMethods, saleStatuses } from '~/constants'
import { type ExportableToCsv, exportToCsv } from '~/lib/csv'

type Props<TData> = {
  table: Table<TData>
}

const SalesDataTableToolbar = <TData,>({ table }: Props<TData>) => {
  const isFiltered = table.getState().columnFilters.length > 0

  const resetFilters = () => {
    table.resetColumnFilters()
  }

  const exportConfing = useMemo(
    () =>
      mkConfig({
        fieldSeparator: ',',
        decimalSeparator: '.',
        useKeysAsHeaders: true,
        filename: `ventas-${new Date().toISOString()}`,
      }),
    [],
  )

  const exportData = () => {
    const rows = table
      .getFilteredRowModel()
      .rows.map((row) => row.original as ExportableToCsv)
      .map(({ code, createdAt, ...row }) => ({
        ...row,
        createdAt: new Date(createdAt as unknown as string).toLocaleString(),
        paymentMethod:
          paymentMethods.find((method) => method.id === row.paymentMethod)
            ?.label ?? 'Desconocido',
      }))

    exportToCsv(exportConfing, rows)
  }

  return (
    <div className="grid grid-cols-1 justify-between gap-2 md:grid-cols-2">
      <div className="grid gap-2">
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div>
            <DateRangeFilter table={table} />
          </div>

          {table.getColumn('paymentMethod') && (
            <DataTableFacetedFilter
              column={table.getColumn('paymentMethod')}
              title="Método de pago"
              options={paymentMethods}
            />
          )}

          {table.getColumn('status') && (
            <DataTableFacetedFilter
              column={table.getColumn('status')}
              title="Estado"
              options={saleStatuses}
            />
          )}

          {isFiltered && (
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              <FilterX />
              Limpiar filtros
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2 md:justify-end">
        <Button size="sm" variant="secondary" onClick={exportData}>
          <FileDown />
          Exportar
        </Button>
      </div>
    </div>
  )
}

export default SalesDataTableToolbar
