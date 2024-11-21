import type { Table } from '@tanstack/react-table'
import { CircleXIcon, SearchIcon } from 'lucide-react'
import { DataTableViewOptions } from '~/components/data-table-view-options'
import { Input } from '~/components/ui/input'

type Props<TData> = {
  table: Table<TData>
}

export const EmployeesDataTableToolbar = <TData,>({ table }: Props<TData>) => {
  return (
    <div className="grid grid-cols-1 justify-between gap-2 overflow-auto md:grid-cols-2">
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <div className="space-y-2">
          <div className="relative">
            <Input
              id="search-product"
              className="peer h-8 ps-9 pe-9 pr-9 pl-9"
              placeholder="Buscar un empleado"
              value={table.getState().globalFilter}
              onChange={(event) => table.setGlobalFilter(event.target.value)}
            />

            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
              <SearchIcon
                size={16}
                strokeWidth={2}
                aria-hidden="true"
                role="presentation"
              />
            </div>

            {table.getState().globalFilter && (
              <button
                className="fade-in zoom-in-75 absolute inset-y-0 end-0 flex h-full w-9 animate-in items-center justify-center rounded-e-lg border border-transparent text-muted-foreground/80 ring-offset-background transition-shadow hover:text-foreground focus-visible:border-ring focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Clear input"
                onClick={() => table.setGlobalFilter('')}
              >
                <CircleXIcon size={16} strokeWidth={2} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2 md:justify-end">
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
