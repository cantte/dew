import { Suspense } from "react";
import { columns } from "~/app/(dashboard)/dashboard/orders/columns";
import OrdersDataTable from "~/app/(dashboard)/dashboard/orders/data-table";
import OrdersOverview from "~/components/orders/overview";
import NotFoundStoreAlert from "~/components/stores/not-found.alert";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/server";

const OrdersPage = async () => {
  const store = await api.store.findCurrent();

  if (store === undefined) {
    return <NotFoundStoreAlert />;
  }

  const orders = await api.order.list({
    storeId: store.id,
  });

  return (
    <div className="space-y-4">
      <Suspense fallback={<Skeleton className="h-5 w-full max-w-[450px]" />}>
        <OrdersOverview />
      </Suspense>

      <OrdersDataTable columns={columns} data={orders} storeId={store.id} />
    </div>
  );
};

export default OrdersPage;
