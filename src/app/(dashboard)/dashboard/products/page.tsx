import { columns } from "~/app/(dashboard)/dashboard/products/columns";
import ProductDataTable from "~/app/(dashboard)/dashboard/products/data-table";
import ProductsOverview from "~/app/(dashboard)/dashboard/products/overview";
import NotEnoughPermissions from "~/components/not-enough-permissions";
import NotFoundStoreAlert from "~/components/stores/not-found.alert";
import { api } from "~/trpc/server";

const ProductsPage = async () => {
  const store = await api.store.findCurrent();

  if (!store) {
    return <NotFoundStoreAlert />;
  }

  const hasPermissions = await api.rbac.checkPermissions({
    permissions: ["product:view"],
  });

  if (!hasPermissions) {
    return <NotEnoughPermissions />;
  }

  const products = await api.product.list({
    storeId: store.id,
  });

  const overview = await api.product.overview({
    storeId: store.id,
  });

  return (
    <div className="space-y-4">
      <ProductsOverview overview={overview} />

      <ProductDataTable columns={columns} data={products} storeId={store.id} />
    </div>
  );
};

export default ProductsPage;
