"use client";

import {
    getCoreRowModel,
    getFacetedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
} from "@tanstack/react-table";
import type { Order } from "~/app/(dashboard)/dashboard/orders/columns";
import OrdersDataTableToolbar from "~/app/(dashboard)/dashboard/orders/data-table-toolbar";
import DataTable from "~/components/data-table";
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
  const { data: orders } = api.order.list.useQuery(
    { storeId },
    { initialData: data },
  );

  const table = useReactTable<Order>({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
  });

  return (
    <div className="space-y-2">
      <OrdersDataTableToolbar table={table} />
      <DataTable table={table} />
    </div>
  );
};

export default OrdersDataTable;
