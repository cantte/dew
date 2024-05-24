import { endOfDay, startOfDay } from "date-fns";
import { columns } from "~/app/(dashboard)/dashboard/sales/columns";
import SalesDataTable from "~/app/(dashboard)/dashboard/sales/data-table";
import SalesOverview from "~/app/(dashboard)/dashboard/sales/overview";
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

  const from = startOfDay(new Date());
  const to = endOfDay(new Date());
  const overview = await api.sale.overview({
    storeId: store.id,
    from,
    to,
  });

  return (
    <div className="space-y-4">
      <SalesOverview overview={overview} />
      <SalesDataTable columns={columns} data={sales} storeId={store.id} />
    </div>
  );
};

export default SalesPage;
