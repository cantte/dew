import { endOfMonth, startOfMonth } from "date-fns";
import Dashboard from "~/app/(dashboard)/dashboard/dashboard";
import NotFoundStoreAlert from "~/components/stores/not-found.alert";
import { api } from "~/trpc/server";

const DashboardPage = async () => {
  const store = await api.store.findCurrent();
  if (!store) {
    return <NotFoundStoreAlert />;
  }

  const from = startOfMonth(new Date());
  const to = endOfMonth(new Date());

  const overview = await api.sale.overview({
    from,
    to,
    storeId: store.id,
  });

  const report = await api.sale.report({
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
        report={report}
        mostSoldProducts={mostSoldProducts}
        lowStockProducts={lowStockProducts}
        storeId={store.id}
      />
    </main>
  );
};

export default DashboardPage;
