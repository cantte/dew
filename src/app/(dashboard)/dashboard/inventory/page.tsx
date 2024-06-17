import { columns } from "~/app/(dashboard)/dashboard/inventory/columns";
import InventoryDataTable from "~/app/(dashboard)/dashboard/inventory/data-table";
import NotEnoughPermissions from "~/components/not-enough-permissions";
import NotFoundStoreAlert from "~/components/stores/not-found.alert";
import { api } from "~/trpc/server";

const InventoryPage = async () => {
  const store = await api.store.findCurrent();

  if (!store) {
    return <NotFoundStoreAlert />;
  }

  const hasPermissions = await api.rbac.checkPermissions({
    permissions: ["inventory:create"],
  });

  if (!hasPermissions) {
    return <NotEnoughPermissions />;
  }

  const productInventory = await api.inventory.list({
    storeId: store.id,
  });

  return (
    <InventoryDataTable
      columns={columns}
      data={productInventory}
      storeId={store.id}
    />
  );
};

export default InventoryPage;
