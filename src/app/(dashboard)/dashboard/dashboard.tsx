"use client";

import SalesOverview from "~/app/(dashboard)/dashboard/sales/overview";
import LowStockProducts from "~/components/dashboard/low-stock-products";
import MostSoldProducts from "~/components/dashboard/most-sold-products";
import TotalProfit from "~/components/dashboard/total-profit";
import TotalRevenue from "~/components/dashboard/total-revenue";
import { type RouterOutputs } from "~/trpc/shared";

type Props = {
  overview: RouterOutputs["sale"]["overview"];
  report: RouterOutputs["sale"]["report"];

  mostSoldProducts: RouterOutputs["sale"]["mostSoldProducts"];
  lowStockProducts: RouterOutputs["inventory"]["lowStock"];
};

const Dashboard = ({
  overview,
  report,
  mostSoldProducts,
  lowStockProducts,
}: Props) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <span className="font-semibold">Panel de control</span>

        <SalesOverview overview={overview} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
        <TotalRevenue
          revenue={report.totalAmount}
          revenueImprovement={report.amountImprovement}
          revenueData={report.totalAmountPerDay}
        />

        <TotalProfit
          profit={report.totalProfit}
          profitImprovement={report.profitImprovement}
          profitData={report.totalProfitPerDay}
        />
      </div>

      <MostSoldProducts mostSoldProducts={mostSoldProducts} />

      <LowStockProducts lowStockProducts={lowStockProducts} />
    </div>
  );
};

export default Dashboard;
