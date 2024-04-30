"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { type Row } from "@tanstack/react-table";
import { ProductInventory } from "~/app/(dashboard)/dashboard/inventory/columns";
import UpdateProductQuantityModal from "~/components/products/update-quantity-modal";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

type DataTableRowActionsProps = {
  row: Row<ProductInventory>;
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
        <UpdateProductQuantityModal product={row.original} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DataTableRowActions;
