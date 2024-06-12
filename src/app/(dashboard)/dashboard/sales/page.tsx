import { Suspense } from "react";
import { columns } from "~/app/(dashboard)/dashboard/sales/columns";
import SalesDataTable from "~/app/(dashboard)/dashboard/sales/data-table";
import SalesOverview from "~/app/(dashboard)/dashboard/sales/overview";
import NotFoundStoreAlert from "~/components/stores/not-found.alert";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/server";

const SalesPage = async () => {
  const store = await api.store.findCurrent();

  if (store === undefined) {
    return <NotFoundStoreAlert />;
  }

  const sales = await api.sale.list({
    storeId: store.id,
  });

  return (
    <div className="space-y-4">
      <Suspense fallback={<Skeleton className="h-5 w-full max-w-[450px]" />}>
        <SalesOverview />
      </Suspense>
      <SalesDataTable columns={columns} data={sales} storeId={store.id} />
    </div>
  );
};

export default SalesPage;
