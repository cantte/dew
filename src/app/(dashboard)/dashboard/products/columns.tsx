"use client";

import { type ColumnDef } from "@tanstack/react-table";
import DataTableRowActions from "~/app/(dashboard)/dashboard/products/data-table-row-actions";
import { type RouterOutputs } from "~/trpc/shared";

export type Product = RouterOutputs["product"]["list"][number];

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "code",
    header: "Código",
  },
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "purchasePrice",
    header: "Precio de compra",
    cell: ({ row }) => {
      return (
        <span>
          {Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
          }).format(row.original.purchasePrice)}
        </span>
      );
    },
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
    id: "actions",
    cell: ({ row }) => {
      return <DataTableRowActions row={row} />;
    },
  },
];
