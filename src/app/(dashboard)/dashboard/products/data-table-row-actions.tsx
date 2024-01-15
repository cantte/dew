"use client";

import { type Product } from "~/app/(dashboard)/dashboard/products/columns";
import { type Row } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import UpdateQuantityModal from "~/components/products/update-quantity-modal";

type DataTableRowActionsProps = {
  row: Row<Product>;
};

const DataTableRowActions = ({ row }: DataTableRowActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem disabled>Editar</DropdownMenuItem>
        <DropdownMenuItem disabled>Eliminar</DropdownMenuItem>
        <UpdateQuantityModal product={row.original} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DataTableRowActions;
