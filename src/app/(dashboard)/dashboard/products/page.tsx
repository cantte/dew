import Link from "next/link";
import { columns } from "~/app/(dashboard)/dashboard/products/columns";
import ProductDataTable from "~/app/(dashboard)/dashboard/products/data-table";
import ProductsOverview from "~/app/(dashboard)/dashboard/products/overview";
import NotFoundStoreAlert from "~/components/stores/not-found.alert";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/server";

const ProductsPage = async () => {
  const store = await api.store.findCurrent();

  if (!store) {
    return <NotFoundStoreAlert />;
  }

  const products = await api.product.list({
    storeId: store.id,
  });

  const overview = await api.product.overview({
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

      <div className="mt-2 space-y-4">
        <ProductsOverview overview={overview} />

        <ProductDataTable
          columns={columns}
          data={products}
          storeId={store.id}
        />
      </div>
    </div>
  );
};

export default ProductsPage;
