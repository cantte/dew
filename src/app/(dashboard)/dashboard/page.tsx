import { Suspense } from "react";
import SalesOverview from "~/app/(dashboard)/dashboard/sales/overview";
import LowStockProducts from "~/components/dashboard/low-stock-products";
import MostSoldProducts from "~/components/dashboard/most-sold-products";
import OrdersReport from "~/components/dashboard/orders-report";
import SalesReport from "~/components/dashboard/sales-report";
import NotFoundStoreAlert from "~/components/stores/not-found.alert";
import { Skeleton } from "~/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { api } from "~/trpc/server";

const DashboardPage = async () => {
  const store = await api.store.findCurrent();
  if (!store) {
    return <NotFoundStoreAlert />;
  }

  return (
    <main className="space-y-4">
      <Tabs defaultValue="sales">
        <TabsList>
          <TabsTrigger value="sales">Resumen de ventas</TabsTrigger>
          <TabsTrigger value="orders">Resumen de ordenes</TabsTrigger>
        </TabsList>
        <TabsContent value="sales">
          <div className="space-y-4">
            <Suspense
              fallback={<Skeleton className="h-5 w-full max-w-[450px]" />}
            >
              <SalesOverview />
            </Suspense>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
              <Suspense fallback={<SalesReportFallback />}>
                <SalesReport />
              </Suspense>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
              <Suspense fallback={<SalesReportFallback />}>
                <OrdersReport />
              </Suspense>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Suspense fallback={<Skeleton className="h-10 w-full" />}>
        <MostSoldProducts />
      </Suspense>

      <Suspense fallback={<Skeleton className="h-10 w-full" />}>
        <LowStockProducts />
      </Suspense>
    </main>
  );
};

const SalesReportFallback = () => {
  return (
    <>
      <Skeleton className="h-[200px] w-full" />
      <Skeleton className="h-[200px] w-full" />
    </>
  );
};

export default DashboardPage;
