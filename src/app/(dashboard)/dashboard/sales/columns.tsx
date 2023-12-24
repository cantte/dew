"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { type RouterOutputs } from "~/trpc/shared";

export type Sale = RouterOutputs["sale"]["list"][number];

export const columns: ColumnDef<Sale>[] = [
  {
    accessorKey: "code",
    header: "Código",
  },
  {
    accessorKey: "customerId",
    header: "Cliente",
  },
  {
    accessorKey: "amount",
    header: "Total",
    cell: ({ row }) => {
      return (
        <span>
          {Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
          }).format(row.original.amount)}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Fecha",
    cell: ({ row }) => {
      return (
        <span>
          {Intl.DateTimeFormat("es-CO", {
            dateStyle: "short",
            timeStyle: "short",
          }).format(new Date(row.original.createdAt))}
        </span>
      );
    },
  },
];
