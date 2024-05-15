"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { type Row } from "@tanstack/react-table";
import NextLink from "next/link";
import { type Product } from "~/app/(dashboard)/dashboard/products/columns";
import BarcodeModal from "~/components/products/barcode-modal";
import DeleteProductModal from "~/components/products/delete-modal";
import LinkToStoresModal from "~/components/products/link-to-stores-modal";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

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
        <DropdownMenuItem asChild>
          <NextLink href={`/products/${row.original.id}/edit`}>Editar</NextLink>
        </DropdownMenuItem>
        <DeleteProductModal product={row.original} />
        <BarcodeModal product={row.original} />
        <LinkToStoresModal product={row.original} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DataTableRowActions;
