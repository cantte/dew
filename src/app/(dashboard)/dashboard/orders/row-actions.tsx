import type { Row } from "@tanstack/react-table";
import { Ellipsis } from "lucide-react";
import Link from "next/link";
import type { Order } from "~/app/(dashboard)/dashboard/orders/columns";
import ConfirmCancelOrderDialog from "~/components/orders/confirm-cancel.dialog";
import ConfirmMoveOrderStatusDialog from "~/components/orders/confirm-move-status.dialog";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

type Props = {
  row: Row<Order>;
};

const OrderRowActions = ({ row }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <Ellipsis className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/orders/${row.original.id}`}>
            Ver detalles
          </Link>
        </DropdownMenuItem>
        {row.original.status !== "cancelled" &&
          row.original.status !== "delivered" && (
            <>
              <ConfirmMoveOrderStatusDialog order={row.original} />
              <ConfirmCancelOrderDialog order={row.original} />
            </>
          )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default OrderRowActions;
