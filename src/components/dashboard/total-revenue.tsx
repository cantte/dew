"use client";

import LineChartCard from "~/components/line-chart-card";
import type { RouterOutputs } from "~/trpc/shared";

type Props = {
  revenue: number;
  revenueImprovement: number;

  revenueData: RouterOutputs["sale"]["report"]["totalAmountPerDay"];
};

const TotalRevenue = ({ revenue, revenueImprovement, revenueData }: Props) => {
  return (
    <LineChartCard
      title="Ingresos totales"
      value={revenue}
      valueImprovement={revenueImprovement}
      summary={revenueData}
    />
  );
};

export default TotalRevenue;
