import { endOfDay, startOfDay } from "date-fns";
import Dashboard from "~/app/(dashboard)/dashboard/dashboard";
import NotFoundStoreAlert from "~/components/stores/not-found.alert";
import { api } from "~/trpc/server";

const DashboardPage = async () => {
  const store = await api.store.findCurrent();
  if (!store) {
    return <NotFoundStoreAlert />;
  }

  const from = startOfDay(new Date());
  const to = endOfDay(new Date());
  const overview = await api.sale.overview({
    from,
    to,
    storeId: store.id,
  });
  const mostSoldProducts = await api.sale.mostSoldProducts();
  const lowStockProducts = await api.inventory.lowStock({
    storeId: store.id,
  });

  return (
    <main>
      <Dashboard
        overview={overview}
        mostSoldProducts={mostSoldProducts}
        lowStockProducts={lowStockProducts}
        storeId={store.id}
      />
    </main>
  );
};

export default DashboardPage;
