"use client";

import { ArchiveIcon } from "@radix-ui/react-icons";
import { addDays, startOfMonth, startOfWeek } from "date-fns";
import { useState } from "react";
import DateRange from "~/components/date-range";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
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
  mostSoldProducts: RouterOutputs["sale"]["mostSoldProducts"];
  lowStockProducts: RouterOutputs["product"]["lowStock"];
};

const Dashboard = ({ overview, mostSoldProducts, lowStockProducts }: Props) => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  const setToday = () => {
    setDate({
      from: new Date(),
      to: new Date(),
    });
  };

  const setThisWeek = () => {
    const today = new Date();
    const start = startOfWeek(today, { weekStartsOn: 1 });

    setDate({
      from: start,
      to: addDays(start, 6),
    });
  };

  const setThisMonth = () => {
    const today = new Date();
    const start = startOfMonth(today);

    setDate({
      from: start,
      to: addDays(start, 30),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-x-2 md:space-y-0">
        <DateRange
          className="w-[300px]"
          selected={date}
          onSelectRange={setDate}
        />

        <div className="space-x-2">
          <Button
            variant="outline"
            className="border-dashed"
            onClick={setToday}
          >
            Hoy
          </Button>

          <Button
            variant="outline"
            className="border-dashed"
            onClick={setThisWeek}
          >
            Esta semana
          </Button>

          <Button
            variant="outline"
            className="border-dashed"
            onClick={setThisMonth}
          >
            Este mes
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos</CardTitle>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
              }).format(+overview.revenue)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Intl.NumberFormat("es-CO").format(+overview.customers)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas</CardTitle>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Intl.NumberFormat("es-CO").format(+overview.sales)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos</CardTitle>

            <ArchiveIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Intl.NumberFormat("es-CO").format(+overview.products)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col space-y-4">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Productos más vendidos
        </h3>
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
                        <TooltipTrigger asChild>
                          <Badge className="mt-2 bg-green-700 hover:bg-green-700/80 dark:bg-green-500 dark:hover:bg-green-500/80">
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
