import Dashboard from "~/app/(dashboard)/dashboard/dashboard";
import { api } from "~/trpc/server";

const DashboardPage = async () => {
  const overview = await api.sale.overview.query();
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
