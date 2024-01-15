"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { type RouterOutputs } from "~/trpc/shared";
import DataTableRowActions from "~/app/(dashboard)/dashboard/products/data-table-row-actions";

export type Product = RouterOutputs["product"]["list"][number];

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "salePrice",
    header: "Precio de venta",
    cell: ({ row }) => {
      return (
        <span>
          {Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
          }).format(row.original.salePrice)}
        </span>
      );
    },
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) => {
      return (
        <span>{Intl.NumberFormat("es-CO").format(row.original.stock)}</span>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: "Existencia",
    cell: ({ row }) => {
      return (
        <span>{Intl.NumberFormat("es-CO").format(row.original.quantity)}</span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <DataTableRowActions row={row} />;
    },
  },
];
