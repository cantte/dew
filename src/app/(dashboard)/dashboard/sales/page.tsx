import { columns } from "~/app/(dashboard)/dashboard/sales/columns";
import SalesDataTable from "~/app/(dashboard)/dashboard/sales/data-table";
import NotFoundStoreAlert from "~/components/stores/not-found.alert";
import { api } from "~/trpc/server";

const SalesPage = async () => {
  const store = await api.store.findCurrent();

  if (store === undefined) {
    return <NotFoundStoreAlert />;
  }

  const sales = await api.sale.list({
    storeId: store.id,
  });

  return (
    <div>
      <div className="flex justify-between">
        <span className="font-semibold tracking-tight">Ventas</span>
      </div>

      <div className="mt-4">
        <SalesDataTable columns={columns} data={sales} storeId={store.id} />
      </div>
    </div>
  );
};

export default SalesPage;
