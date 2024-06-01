import { PlusCircle } from "lucide-react";
import Link from "next/link";
import NotFoundStoreAlert from "~/components/stores/not-found.alert";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/server";

const OrdersPage = async () => {
  const store = await api.store.findCurrent();

  if (store === undefined) {
    return <NotFoundStoreAlert />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-bold">Ordenes</span>

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

export default OrdersPage;
