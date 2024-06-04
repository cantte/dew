import { columns } from "~/app/(dashboard)/dashboard/orders/columns";
import OrdersDataTable from "~/app/(dashboard)/dashboard/orders/data-table";
import NotFoundStoreAlert from "~/components/stores/not-found.alert";
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
      <OrdersDataTable columns={columns} data={orders} storeId={store.id} />
    </div>
  );
};

export default OrdersPage;
