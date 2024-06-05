"use client";

import {
  getCoreRowModel,
  getFacetedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { useState } from "react";
import { type ProductInventory } from "~/app/(dashboard)/dashboard/inventory/columns";
import ProductsDataTableToolbar from "~/app/(dashboard)/dashboard/products/data-table-toolbar";
import DataTable from "~/components/data-table";
import DataTablePagination from "~/components/data-table-pagination";
import { api } from "~/trpc/react";

type Props<TValue> = {
  columns: ColumnDef<ProductInventory, TValue>[];
  data: ProductInventory[];
  storeId: string;
};

const InventoryDataTable = <TValue,>({
  columns,
  data,
  storeId,
}: Props<TValue>) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { data: inventory } = api.inventory.list.useQuery(
    {
      storeId: storeId,
    },
    {
      initialData: data,
    },
  );

  const table = useReactTable<ProductInventory>({
    data: inventory,
    columns,
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
  });

  return (
    <div className="space-y-4">
      <ProductsDataTableToolbar table={table} />
      <DataTable table={table} />
      <DataTablePagination table={table} />
    </div>
  );
};

export default InventoryDataTable;
