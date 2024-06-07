import type { Table } from "@tanstack/react-table";
import { FilterX, PlusCircle } from "lucide-react";
import Link from "next/link";
import DataTableFacetedFilter from "~/components/data-table-faceted-filter";
import { Button } from "~/components/ui/button";
import { orderStatus } from "~/constants";

type Props<TData> = {
  table: Table<TData>;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const OrdersDataTableToolbar = <TData,>({ table }: Props<TData>) => {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-1 items-center space-x-2">
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Estado"
            options={orderStatus}
          />
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Limpiar filtros
            <FilterX className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex space-x-2">
        <Button asChild size="sm" className="h-7 gap-1">
          <Link href="/orders/create">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Nueva orden
            </span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default OrdersDataTableToolbar;
