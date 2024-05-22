import { columns } from "~/app/(dashboard)/dashboard/inventory/columns";
import InventoryDataTable from "~/app/(dashboard)/dashboard/inventory/data-table";
import NotFoundStoreAlert from "~/components/stores/not-found.alert";
import { api } from "~/trpc/server";

const InventoryPage = async () => {
  const store = await api.store.findCurrent();

  if (!store) {
    return <NotFoundStoreAlert />;
  }

  const productInventory = await api.inventory.list({
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
