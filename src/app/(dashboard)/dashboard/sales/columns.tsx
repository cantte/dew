"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { type DateRange } from "react-day-picker";
import { type RouterOutputs } from "~/trpc/shared";

export type Sale = RouterOutputs["sale"]["list"][number];

export const columns: ColumnDef<Sale>[] = [
  {
    id: "customer",
    header: "Cliente",
    cell: ({ row }) => {
      return (
        <span>
          {row.original.customer.id}, {row.original.customer.name}
        </span>
      );
    },
    filterFn: (rows, id, value: string) => {
      const customer = rows.original.customer;

      return (
        customer.id.includes(value) ||
        customer.name.toLowerCase().includes(value.toLowerCase())
      );
    },
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
    accessorKey: "paymentMethod",
    header: "Método de pago",
    cell: ({ row }) => {
      return (
        <span>
          {row.original.paymentMethod === "cash" ? "Efectivo" : "Desconocido"}
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
    filterFn: (rows, id, value: DateRange) => {
      const createdAt = rows.original.createdAt;

      if (value.from === undefined) {
        return true;
      }

      if (value.to === undefined) {
        return true;
      }

      return (
        createdAt >= value.from &&
        createdAt <= new Date(value.to.getTime() + 86400000)
      );
    },
  },
];
