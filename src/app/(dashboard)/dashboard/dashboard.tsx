"use client";

import {
  Tooltip as ChartTooltip,
  Line,
  LineChart,
  ResponsiveContainer,
} from "recharts";
import SalesOverview from "~/app/(dashboard)/dashboard/sales/overview";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { type RouterOutputs } from "~/trpc/shared";

type Props = {
  overview: RouterOutputs["sale"]["overview"];
  report: RouterOutputs["sale"]["report"];

  mostSoldProducts: RouterOutputs["sale"]["mostSoldProducts"];
  lowStockProducts: RouterOutputs["inventory"]["lowStock"];

  storeId: string;
};

const Dashboard = ({
  overview,
  report,
  mostSoldProducts,
  lowStockProducts,
  storeId,
}: Props) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <span className="font-semibold">Panel de control</span>

        <SalesOverview overview={overview} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-normal">
              Ingresos totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
              }).format(report.totalAmount)}
            </div>
            <p className="text-xs text-muted-foreground">
              {report.amountImprovement > 0 ? "+" : ""}
              {Intl.NumberFormat("es-CO", {
                style: "percent",
                minimumFractionDigits: 2,
              }).format(report.amountImprovement)}{" "}
              respecto al mes anterior
            </p>
            <div className="h-[80px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={report.totalAmountPerDay}
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

                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <p className="text-sm">
                              {Intl.NumberFormat("es-CO", {
                                style: "currency",
                                currency: "COP",
                              }).format(+firstPayload.value!)}
                            </p>

                            <p className="text-xs text-muted-foreground">
                              {Intl.DateTimeFormat("es-CO").format(
                                Date.parse(
                                  (firstPayload.payload as { date: string })
                                    .date,
                                ),
                              )}
                            </p>
                          </div>
                        );
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-normal">
              Ganancias totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
              }).format(report.totalProfit)}
            </div>
            <p className="text-xs text-muted-foreground">
              {report.profitImprovement > 0 ? "+" : ""}
              {Intl.NumberFormat("es-CO", {
                style: "percent",
                minimumFractionDigits: 2,
              }).format(report.profitImprovement)}{" "}
              respecto al mes anterior
            </p>
            <div className="h-[80px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={report.totalProfitPerDay}
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

                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <p className="text-sm">
                              {Intl.NumberFormat("es-CO", {
                                style: "currency",
                                currency: "COP",
                              }).format(+firstPayload.value!)}
                            </p>

                            <p className="text-xs text-muted-foreground">
                              {Intl.DateTimeFormat("es-CO", {
                                day: "numeric",
                                month: "short",
                              }).format(
                                Date.parse(
                                  (firstPayload.payload as { date: string })
                                    .date,
                                ),
                              )}
                            </p>
                          </div>
                        );
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
      </div>

      <div className="flex flex-col space-y-2">
        <span className="font-semibold tracking-tight">
          Productos más vendidos
        </span>
        <div>
          {mostSoldProducts.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
              {mostSoldProducts.map((product) => (
                <Card key={product.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {product.name}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      {Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                      }).format(+product.amount! * +product.quantity!)}{" "}
                      generados
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {Intl.NumberFormat("es-CO").format(
                        +product.quantity! ?? 0,
                      )}
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge className="mt-2" variant="success">
                            +
                            {Intl.NumberFormat("es-CO", {
                              style: "currency",
                              currency: "COP",
                            }).format(+product.profit!)}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div>Ganancias</div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-2xl font-semibold">No hay productos</h3>
              <p className="text-gray-500">No se han vendido productos aún</p>
            </div>
          )}
        </div>
      </div>

      {lowStockProducts.length > 0 && (
        <div className="flex flex-col space-y-4 rounded border border-dashed p-4">
          <p className="text-sm text-muted-foreground">
            Productos con poco stock
          </p>
          <div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
              {lowStockProducts.map((product) => (
                <Badge key={product.id} variant="destructive">
                  {product.name}, {product.quantity} unidades restantes en
                  stock, mínimo {product.stock} unidades.
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
