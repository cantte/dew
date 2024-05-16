"use client";

import { type ColumnDef } from "@tanstack/react-table";
import UpdateEmployeeModal from "~/app/(dashboard)/dashboard/stores/update.modal";
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
  {
    id: "actions",
    cell: ({ row }) => {
      return <UpdateEmployeeModal employee={row.original} />;
    },
  },
];
