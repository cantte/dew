import {
    Tooltip as ChartTooltip,
    Line,
    LineChart,
    ResponsiveContainer,
} from "recharts";
import ValueDateTooltip from "~/components/dashboard/value-date-tooltip";
import { Card } from "~/components/ui/card";

import { CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { RouterOutputs } from "~/trpc/shared";

type Props = {
  profit: number;
  profitImprovement: number;

  profitData: RouterOutputs["sale"]["report"]["totalProfitPerDay"];
};

const TotalProfit = ({ profit, profitImprovement, profitData }: Props) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-normal">Ganancias totales</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
          }).format(profit)}
        </div>
        <p className="text-xs text-muted-foreground">
          {profitImprovement > 0 ? "+" : ""}
          {Intl.NumberFormat("es-CO", {
            style: "percent",
            minimumFractionDigits: 2,
          }).format(profitImprovement)}{" "}
          respecto al mes anterior
        </p>
        <div className="h-[80px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={profitData}
              dataKey="total"
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload) {
                    const firstPayload = payload[0];

                    if (!firstPayload) {
                      return null;
                    }

                    const value = +(firstPayload.value ?? 0);
                    const date = new Date(
                      (firstPayload.payload as { date: string }).date +
                        "T00:00:00", // Prevents timezone issues
                    );

                    return <ValueDateTooltip value={value} date={date} />;
                  }
                  return null;
                }}
              />
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

export default TotalProfit;
