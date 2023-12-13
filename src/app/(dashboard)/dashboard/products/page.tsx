import { Button } from "~/components/ui/button";
import Link from "next/link";
import { api } from "~/trpc/server";
import { columns } from "~/app/(dashboard)/dashboard/products/columns";
import DataTable from "~/app/(dashboard)/dashboard/products/data-table";

const DashboardPage = async () => {
  const products = await api.product.list.query();

  return (
    <div>
      <div className="flex justify-between">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Productos
        </h3>

        <Button asChild variant="outline">
          <Link href="/products/create">Crear producto</Link>
        </Button>
      </div>

      <div className="mt-4">
        <DataTable columns={columns} data={products} />
      </div>
    </div>
  );
};

export default DashboardPage;
