import { endOfMonth, startOfMonth } from "date-fns";
import TotalProfit from "~/components/dashboard/total-profit";
import TotalRevenue from "~/components/dashboard/total-revenue";

import { api } from "~/trpc/server";

const SalesReport = async () => {
  const store = await api.store.findCurrent();
  if (!store) {
    return null;
  }

  const hasPermission = await api.rbac.checkPermissions({
    permissions: ["sale_view"],
  });

  if (!hasPermission) {
    return null;
  }

  const today = new Date();
  const from = startOfMonth(today);
  const to = endOfMonth(today);

  const report = await api.sale.report({
    from,
    to,
    storeId: store.id,
  });

  return (
    <>
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
    </>
  );
};

export default SalesReport;
