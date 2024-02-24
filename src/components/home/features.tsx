import {
  Coins,
  LineChart,
  ShoppingBasket,
  ShoppingCart,
  Store,
  UserRound,
} from "lucide-react";
import React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

const FeaturesSection = () => {
  return (
    <section id="features" className="flex flex-col space-y-4">
      <h2 className="text-center text-3xl font-semibold">Características</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-none">
          <CardHeader className="flex items-center">
            <span className="rounded-full bg-primary p-2">
              <Store className="h-4 w-4 text-primary-foreground" />
            </span>
            <CardTitle className="text-primary">Tiendas</CardTitle>
            <CardDescription>Lleva un control de tus tiendas.</CardDescription>
          </CardHeader>
        </Card>

        <Card className="shadow-none">
          <CardHeader className="flex items-center">
            <span className="rounded-full bg-primary p-2">
              <ShoppingBasket className="h-4 w-4 text-primary-foreground" />
            </span>
            <CardTitle className="text-primary">Productos</CardTitle>
            <CardDescription>
              Lleva un control de tus productos.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="shadow-none">
          <CardHeader className="flex items-center">
            <span className="rounded-full bg-primary p-2">
              <ShoppingCart className="h-4 w-4 text-primary-foreground" />
            </span>
            <CardTitle className="text-primary">Ventas</CardTitle>
            <CardDescription>Lleva un control de tus ventas.</CardDescription>
          </CardHeader>
        </Card>

        <Card className="shadow-none">
          <CardHeader className="flex items-center">
            <span className="rounded-full bg-primary p-2">
              <UserRound className="h-4 w-4 text-primary-foreground" />
            </span>
            <CardTitle className="text-primary">Clientes</CardTitle>
            <CardDescription>Manejo global de clientes.</CardDescription>
          </CardHeader>
        </Card>

        <Card className="shadow-none">
          <CardHeader className="flex items-center">
            <span className="rounded-full bg-primary p-2">
              <Coins className="h-4 w-4 text-primary-foreground" />
            </span>
            <CardTitle className="text-primary">Caja registradora</CardTitle>
            <CardDescription>
              Lleva un control de tus ingresos y egresos.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="shadow-none">
          <CardHeader className="flex items-center">
            <span className="rounded-full bg-primary p-2">
              <LineChart className="h-4 w-4 text-primary-foreground" />
            </span>
            <CardTitle className="text-primary">Reportes</CardTitle>
            <CardDescription>
              Genera reportes de tus ventas y productos.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </section>
  );
};

export default FeaturesSection;
