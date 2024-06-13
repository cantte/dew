"use client";

import {
  Tooltip as ChartTooltip,
  Line,
  LineChart,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import ValueDateTooltip from "~/components/dashboard/value-date-tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { RouterOutputs } from "~/trpc/shared";

const Tooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
  if (active && payload) {
    const firstPayload = payload[0];

    if (!firstPayload) {
      return null;
    }

    const value = +(firstPayload.value ?? 0);
    const date = new Date(
      (firstPayload.payload as { date: string }).date + "T00:00:00", // Prevents timezone issues
    );

    return <ValueDateTooltip value={value} date={date} />;
  }
  return null;
};

type Props = {
  revenue: number;
  revenueImprovement: number;

  revenueData: RouterOutputs["sale"]["report"]["totalAmountPerDay"];
};

const TotalRevenue = ({ revenue, revenueImprovement, revenueData }: Props) => {
  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-normal">Ingresos totales</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
          }).format(revenue)}
        </div>
        <p className="text-xs text-muted-foreground">
          {revenueImprovement > 0 ? "+" : ""}
          {Intl.NumberFormat("es-CO", {
            style: "percent",
            minimumFractionDigits: 2,
          }).format(revenueImprovement)}{" "}
          respecto al mes anterior
        </p>
        <div className="h-[80px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={revenueData}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <ChartTooltip content={<Tooltip />} />
              <Line
                type="monotone"
                strokeWidth={2}
                dataKey="total"
                activeDot={{
                  r: 6,
                  style: { fill: "hsl(var(--primary))", opacity: 0.25 },
                }}
                style={
                  {
                    stroke: "hsl(var(--primary))",
                  } as React.CSSProperties
                }
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TotalRevenue;
