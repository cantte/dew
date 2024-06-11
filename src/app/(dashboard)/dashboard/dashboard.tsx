"use client";

import SalesOverview from "~/app/(dashboard)/dashboard/sales/overview";
import LowStockProducts from "~/components/dashboard/low-stock-products";
import MostSoldProducts from "~/components/dashboard/most-sold-products";
import TotalProfit from "~/components/dashboard/total-profit";
import TotalRevenue from "~/components/dashboard/total-revenue";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { type RouterOutputs } from "~/trpc/shared";

type Props = {
  saleOverview: RouterOutputs["sale"]["overview"];
  salesReport: RouterOutputs["sale"]["report"];

  ordersReport: RouterOutputs["order"]["report"];

  mostSoldProducts: RouterOutputs["sale"]["mostSoldProducts"];
  lowStockProducts: RouterOutputs["inventory"]["lowStock"];
};

const Dashboard = ({
  saleOverview,
  salesReport,
  ordersReport,
  mostSoldProducts,
  lowStockProducts,
}: Props) => {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="sales">
        <TabsList>
          <TabsTrigger value="sales">Resumen de ventas</TabsTrigger>
          <TabsTrigger value="orders">Resumen de ordenes</TabsTrigger>
        </TabsList>
        <TabsContent value="sales">
          <div className="space-y-4">
            <SalesOverview overview={saleOverview} />

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
              <TotalRevenue
                revenue={salesReport.totalAmount}
                revenueImprovement={salesReport.amountImprovement}
                revenueData={salesReport.totalAmountPerDay}
              />

              <TotalProfit
                profit={salesReport.totalProfit}
                profitImprovement={salesReport.profitImprovement}
                profitData={salesReport.totalProfitPerDay}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
              <TotalRevenue
                revenue={ordersReport.totalAmount}
                revenueImprovement={ordersReport.amountImprovement}
                revenueData={ordersReport.totalAmountPerDay}
              />

              <TotalProfit
                profit={ordersReport.totalProfit}
                profitImprovement={ordersReport.profitImprovement}
                profitData={ordersReport.totalProfitPerDay}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <MostSoldProducts mostSoldProducts={mostSoldProducts} />

      <LowStockProducts lowStockProducts={lowStockProducts} />
    </div>
  );
};

export default Dashboard;
