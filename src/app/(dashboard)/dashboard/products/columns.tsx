"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { type RouterOutputs } from "~/trpc/shared";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Pencil2Icon } from "@radix-ui/react-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

export type Product = RouterOutputs["product"]["list"][number];

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "salePrice",
    header: "Precio de venta",
  },
  {
    accessorKey: "stock",
    header: "Stock",
  },
  {
    accessorKey: "quantity",
    header: "Existencia",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button asChild variant="secondary" size="icon">
                  <Link href={`/products/edit/${row.original.id}`}>
                    <Pencil2Icon />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Editar</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
];
