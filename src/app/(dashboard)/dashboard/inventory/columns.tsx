"use client";

import { type ColumnDef } from "@tanstack/react-table";
import UpdateInventoryModal from "~/components/products/update-inventory-modal";
import { type RouterOutputs } from "~/trpc/shared";

export type ProductInventory = RouterOutputs["inventory"]["list"][number];

export const columns: ColumnDef<ProductInventory>[] = [
  {
    accessorKey: "code",
    header: "Código",
  },
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "stock",
    header: "Stock",
  },
  {
    accessorKey: "quantity",
    header: "Cantidad",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <UpdateInventoryModal product={row.original} />;
    },
  },
];
