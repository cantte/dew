"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { type RouterOutputs } from "~/trpc/shared";

export type Employee = RouterOutputs["employee"]["byStore"][number];

export const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "email",
    header: "Correo",
  },
  {
    accessorKey: "phone",
    header: "Teléfono",
  },
];
