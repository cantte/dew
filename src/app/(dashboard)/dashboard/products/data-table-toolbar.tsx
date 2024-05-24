"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { type Table } from "@tanstack/react-table";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

type DataTableToolbarProps<TData> = {
  table: Table<TData>;
};

const ProductsDataTableToolbar = <TData,>({
  table,
}: DataTableToolbarProps<TData>) => {
  const isFiltered = table.getState().columnFilters.length > 0;
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Buscar producto"
          value={(table.getColumn("code")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("code")?.setFilterValue(event.target.value)
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

      <div className="flex space-x-2">
        <Button asChild size="sm" className="h-7 gap-1">
          <Link href="/sales/create">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Crear producto
            </span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ProductsDataTableToolbar;
