import type { Table } from "@tanstack/react-table";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";

type Props<TData> = {
  table: Table<TData>;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const OrdersDataTableToolbar = <TData,>({ table }: Props<TData>) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div></div>
      <div className="flex space-x-2">
        <Button asChild size="sm" className="h-7 gap-1">
          <Link href="/orders/create">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Nueva orden
            </span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default OrdersDataTableToolbar;
