"use client";

import { type ColumnDef } from "@tanstack/react-table";
import UpdateInventoryModal from "~/components/products/update-inventory-modal";
import { Badge } from "~/components/ui/badge";
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
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-2">
          <span>{row.original.name}</span>
          {row.original.isLowStock && (
            <Badge variant="destructive">Bajo stock</Badge>
          )}
        </div>
      );
    },
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
