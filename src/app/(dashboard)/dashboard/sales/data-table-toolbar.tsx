'use client'

import type { Table } from '@tanstack/react-table'
import { mkConfig } from 'export-to-csv'
import { FileDown, FilterX } from 'lucide-react'
import { useMemo } from 'react'
import DateRangeFilter from '~/app/(dashboard)/dashboard/sales/date-range-filter'
import DataTableFacetedFilter from '~/components/data-table-faceted-filter'
import { Button } from '~/components/ui/button'
import { paymentMethods } from '~/constants'
import { type ExportableToCsv, exportToCsv } from '~/lib/csv'

type Props<TData extends ExportableToCsv> = {
  table: Table<TData>
}

const SalesDataTableToolbar = <TData extends ExportableToCsv>({
  table,
}: Props<TData>) => {
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
      .rows.map((row) => row.original)
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
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-1 items-center space-x-2">
        <DateRangeFilter table={table} className="h-8" />

        {table.getColumn('paymentMethod') && (
          <DataTableFacetedFilter
            column={table.getColumn('paymentMethod')}
            title="Método de pago"
            options={paymentMethods}
          />
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={resetFilters}
            className="h-8 px-2 lg:px-3"
          >
            Limpiar filtros
            <FilterX className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Button
          size="sm"
          variant="outline"
          className="h-7 gap-1"
          onClick={exportData}
        >
          <FileDown className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Exportar
          </span>
        </Button>
      </div>
    </div>
  )
}

export default SalesDataTableToolbar
