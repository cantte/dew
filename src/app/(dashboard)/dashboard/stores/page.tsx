import { columns } from "~/app/(dashboard)/dashboard/stores/columns";
import StoreDataTable from "~/app/(dashboard)/dashboard/stores/data-table";
import { api } from "~/trpc/server";

const StoresPage = async () => {
  const stores = await api.store.list.query();

  return (
    <div>
      <div className="flex justify-between">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Tiendas
        </h3>
      </div>

      <div className="mt-4">
        <StoreDataTable columns={columns} data={stores} />
      </div>
    </div>
  );
};

export default StoresPage;
