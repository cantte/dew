'use client'

import { Cross2Icon } from '@radix-ui/react-icons'
import type { Table } from '@tanstack/react-table'
import { mkConfig } from 'export-to-csv'
import { FileDown } from 'lucide-react'
import { useMemo } from 'react'
import ImportProductsDialog from '~/app/(dashboard)/dashboard/products/import-dialog'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { type ExportableToCsv, exportToCsv } from '~/lib/csv'

type DataTableToolbarProps<TData extends ExportableToCsv> = {
  table: Table<TData>
}

const ProductsDataTableToolbar = <TData extends ExportableToCsv>({
  table,
}: DataTableToolbarProps<TData>) => {
  const isFiltered = table.getState().columnFilters.length > 0

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
          value={(table.getColumn('code')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('code')?.setFilterValue(event.target.value)
          }
          className="w-[150px] lg:w-[250px]"
        />

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Limpiar filtros
            <Cross2Icon className="ml-2 h-4 w-4" />
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
