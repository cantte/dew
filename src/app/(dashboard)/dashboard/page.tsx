import Dashboard from "~/app/(dashboard)/dashboard/dashboard";
import { api } from "~/trpc/server";

const DashboardPage = async () => {
  const overview = await api.sale.overview.query();
  const mostSoldProducts = await api.sale.mostSoldProducts.query();
  const lowStockProducts = await api.product.lowStock.query();

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">Panel de control</h1>

      <Dashboard
        overview={overview}
        mostSoldProducts={mostSoldProducts}
        lowStockProducts={lowStockProducts}
      />
    </div>
  );
};

export default DashboardPage;
