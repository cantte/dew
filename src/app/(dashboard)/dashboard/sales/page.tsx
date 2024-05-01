import { InfoCircledIcon } from "@radix-ui/react-icons";
import NextLink from "next/link";
import Link from "next/link";
import { columns } from "~/app/(dashboard)/dashboard/sales/columns";
import SalesDataTable from "~/app/(dashboard)/dashboard/sales/data-table";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/server";

const SalesPage = async () => {
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

  const sales = await api.sale.list({
    storeId: store.id,
  });

  return (
    <div>
      <div className="flex justify-between">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Ventas
        </h3>

        <Button asChild>
          <Link href="/sales/create">Crear venta</Link>
        </Button>
      </div>

      <div className="mt-4">
        <SalesDataTable columns={columns} data={sales} storeId={store.id} />
      </div>
    </div>
  );
};

export default SalesPage;
