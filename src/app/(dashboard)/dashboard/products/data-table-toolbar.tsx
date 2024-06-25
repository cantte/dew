'use client'

import type { Table } from '@tanstack/react-table'
import { mkConfig } from 'export-to-csv'
import { FileDown, Filter, FilterX } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import ImportProductsDialog from '~/app/(dashboard)/dashboard/products/import-dialog'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Toggle } from '~/components/ui/toggle'
import { type ExportableToCsv, exportToCsv } from '~/lib/csv'

type DataTableToolbarProps<TData extends ExportableToCsv> = {
  table: Table<TData>
}

const ProductsDataTableToolbar = <TData extends ExportableToCsv>({
  table,
}: DataTableToolbarProps<TData>) => {
  const isFiltered =
    table.getState().columnFilters.length > 0 ||
    table.getState().globalFilter !== ''

  const [showLowStock, setShowLowStock] = useState(false)
  useEffect(() => {
    if (showLowStock) {
      table.setColumnFilters([{ id: 'isLowStock', value: true }])
      return
    }

    table.resetColumnFilters()
  }, [showLowStock])

  const resetFilters = () => {
    table.resetColumnFilters()
    table.setGlobalFilter('')
    setShowLowStock(false)
  }

  const exportConfing = useMemo(
    () =>
      mkConfig({
        fieldSeparator: ',',
        decimalSeparator: '.',
        useKeysAsHeaders: true,
        filename: `productos-${new Date().toISOString()}`,
      }),
    [],
  )

  const exportData = () => {
    const rows = table
      .getFilteredRowModel()
      .rows.map((row) => row.original)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .map(({ id, isLowStock, ...data }) => data)

    exportToCsv(exportConfing, rows)
  }

  return (
    <div className="ml-auto flex items-center gap-2">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Buscar producto"
          value={table.getState().globalFilter}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />

        <Toggle
          variant="outline"
          size="sm"
          className="border-dashed text-xs"
          pressed={showLowStock}
          onPressedChange={setShowLowStock}
        >
          <Filter className="mr-2 h-4 w-4" />
          Productos con stock bajo
        </Toggle>

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
        <ImportProductsDialog />

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

export default ProductsDataTableToolbar
