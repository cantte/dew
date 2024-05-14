"use client";

import { type ColumnDef } from "@tanstack/react-table";
import UpdateEmployeeModal from "~/app/(dashboard)/dashboard/stores/update.modal";
import { type RouterOutputs } from "~/trpc/shared";

export type Employee = RouterOutputs["employee"]["byStore"][number];

export const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: "employee.name",
    header: "Nombre",
  },
  {
    accessorKey: "employee.email",
    header: "Correo",
  },
  {
    accessorKey: "employee.phone",
    header: "Teléfono",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <UpdateEmployeeModal employee={row.original} />;
    },
  },
];
