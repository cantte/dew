import { InfoCircledIcon } from "@radix-ui/react-icons";
import { endOfDay, startOfDay } from "date-fns";
import NextLink from "next/link";
import Dashboard from "~/app/(dashboard)/dashboard/dashboard";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/server";

const DashboardPage = async () => {
  const userPreferences = await api.userPreference.find();
  const store = await api.store.find({
    id: userPreferences?.storeId ?? "0",
  });
  if (store === undefined) {
    return (
      <Alert>
        <InfoCircledIcon className="h-4 w-4 text-muted-foreground" />
        <AlertTitle>Acción requerida</AlertTitle>
        <AlertDescription>
          No ha registrado una tienda, por favor cree una tienda para poder
          continuar.
          <br />
          <Button asChild size="sm" className="mt-2">
            <NextLink href={`/stores/create`}>Crear tienda</NextLink>
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const from = startOfDay(new Date());
  const to = endOfDay(new Date());
  const overview = await api.sale.overview({
    from,
    to,
    storeId: store.id,
  });
  const mostSoldProducts = await api.sale.mostSoldProducts();
  const lowStockProducts = await api.inventory.lowStock({
    storeId: store.id,
  });

  return (
    <main>
      <Dashboard
        overview={overview}
        mostSoldProducts={mostSoldProducts}
        lowStockProducts={lowStockProducts}
        userPreferences={userPreferences}
      />
    </main>
  );
};

export default DashboardPage;
