"use client";

import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { useState } from "react";
import type { Order } from "~/app/(dashboard)/dashboard/orders/columns";
import OrdersDataTableToolbar from "~/app/(dashboard)/dashboard/orders/data-table-toolbar";
import DataTable from "~/components/data-table";
import DataTablePagination from "~/components/data-table-pagination";
import { api } from "~/trpc/react";

type Props<TValue> = {
  columns: ColumnDef<Order, TValue>[];
  data: Order[];
  storeId: string;
};

const OrdersDataTable = <TValue,>({
  columns,
  data,
  storeId,
}: Props<TValue>) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { data: orders } = api.order.list.useQuery(
    { storeId },
    { initialData: data },
  );

  const table = useReactTable<Order>({
    data: orders,
    columns,
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="space-y-2">
      <OrdersDataTableToolbar table={table} />
      <DataTable table={table} />
      <DataTablePagination table={table} />
    </div>
  );
};

export default OrdersDataTable;
