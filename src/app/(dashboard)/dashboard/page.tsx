import { endOfDay, startOfDay } from "date-fns";
import Dashboard from "~/app/(dashboard)/dashboard/dashboard";
import { api } from "~/trpc/server";

const DashboardPage = async () => {
  const from = startOfDay(new Date());
  const to = endOfDay(new Date());
  const overview = await api.sale.overview.query({
    from,
    to,
  });
  const mostSoldProducts = await api.sale.mostSoldProducts.query();
  const lowStockProducts = await api.product.lowStock.query();

  return (
    <main>
      <Dashboard
        overview={overview}
        mostSoldProducts={mostSoldProducts}
        lowStockProducts={lowStockProducts}
      />
    </main>
  );
};

export default DashboardPage;
