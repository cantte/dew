'use client'

import type { Table } from '@tanstack/react-table'
import { mkConfig } from 'export-to-csv'
import { FileDown, FilterX } from 'lucide-react'
import { useMemo } from 'react'
import DateRangeFilter from '~/app/(dashboard)/dashboard/sales/date-range-filter'
import DataTableFacetedFilter from '~/components/data-table-faceted-filter'
import { DataTableViewOptions } from '~/components/data-table-view-options'
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
    <div className="grid grid-cols-1 justify-between gap-2 overflow-auto md:grid-cols-2">
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <div>
          <DateRangeFilter table={table} columnId="Fecha" />
        </div>

        {table.getColumn('Método de pago') && (
          <DataTableFacetedFilter
            column={table.getColumn('Método de pago')}
            title="Método de pago"
            options={paymentMethods}
          />
        )}

        {table.getColumn('Estado') && (
          <DataTableFacetedFilter
            column={table.getColumn('Estado')}
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

      <div className="flex items-center space-x-2 md:justify-end">
        <Button size="sm" variant="outline" onClick={exportData}>
          <FileDown />
          Exportar
        </Button>

        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}

export default SalesDataTableToolbar
