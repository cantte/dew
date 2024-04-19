import { InfoCircledIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { redirect } from "next/navigation";
import { columns } from "~/app/(dashboard)/dashboard/products/columns";
import ProductDataTable from "~/app/(dashboard)/dashboard/products/data-table";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/server";

const DashboardPage = async () => {
  const userPreferences = await api.userPreference.find.query();

  if (userPreferences === undefined) {
    return redirect("/dashboard");
  }

  const store = await api.store.find.query({
    id: userPreferences.storeId,
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
            <Link href={`/stores/create`}>Crear tienda</Link>
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const products = await api.product.list.query({
    storeId: store.id,
  });

  return (
    <div>
      <div className="flex justify-between">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Productos
        </h3>

        <Button asChild>
          <Link href="/products/create">Crear producto</Link>
        </Button>
      </div>

      <div className="mt-4">
        <ProductDataTable
          columns={columns}
          data={products}
          storeId={store.id}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
