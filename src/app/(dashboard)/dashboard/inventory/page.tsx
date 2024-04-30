import { InfoCircledIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { redirect } from "next/navigation";
import { columns } from "~/app/(dashboard)/dashboard/inventory/columns";
import InventoryDataTable from "~/app/(dashboard)/dashboard/inventory/data-table";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/server";

const InventoryPage = async () => {
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

  const productInventory = await api.inventory.list.query({
    storeId: store.id,
  });

  return (
    <div>
      <div className="flex justify-between">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Inventario
        </h3>
      </div>

      <div className="mt-4">
        <InventoryDataTable
          columns={columns}
          data={productInventory}
          storeId={store.id}
        />
      </div>
    </div>
  );
};

export default InventoryPage;
