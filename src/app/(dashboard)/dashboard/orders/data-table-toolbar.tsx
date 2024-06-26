import type { Table } from '@tanstack/react-table'
import { mkConfig } from 'export-to-csv'
import { FileDown, FilterX } from 'lucide-react'
import { useMemo } from 'react'
import DataTableFacetedFilter from '~/components/data-table-faceted-filter'
import { Button } from '~/components/ui/button'
import { orderStatus, paymentMethods } from '~/constants'
import { type ExportableToCsv, exportToCsv } from '~/lib/csv'

type Props<TData> = {
  table: Table<TData>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const OrdersDataTableToolbar = <TData,>({ table }: Props<TData>) => {
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
        filename: `ordenes-${new Date().toISOString()}`,
      }),
    [],
  )

  const exportData = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const rows = table
      .getFilteredRowModel()
      .rows.map((row) => row.original as ExportableToCsv)
      .map(({ code, createdAt, status, ...row }) => ({
        ...row,
        status:
          orderStatus.find((s) => s.id === status)?.label ?? 'Desconocido',
        paymentMethod:
          paymentMethods.find((method) => method.id === row.paymentMethod)
            ?.label ?? 'Desconocido',
        createdAt: new Date(createdAt as unknown as string).toLocaleString(),
      }))

    exportToCsv(exportConfing, rows)
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-1 items-center space-x-2">
        {table.getColumn('status') && (
          <DataTableFacetedFilter
            column={table.getColumn('status')}
            title="Estado"
            options={orderStatus}
          />
        )}

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

export default OrdersDataTableToolbar
