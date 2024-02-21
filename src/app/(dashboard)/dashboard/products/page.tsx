import Link from "next/link";
import { columns } from "~/app/(dashboard)/dashboard/products/columns";
import ProductDataTable from "~/app/(dashboard)/dashboard/products/data-table";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/server";

const DashboardPage = async () => {
  const products = await api.product.list.query();

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
        <ProductDataTable columns={columns} data={products} />
      </div>
    </div>
  );
};

export default DashboardPage;
