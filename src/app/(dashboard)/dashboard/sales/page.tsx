import { api } from "~/trpc/server";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import DataTable from "~/components/data-table";
import { columns } from "~/app/(dashboard)/dashboard/sales/columns";

const SalesPage = async () => {
  const sales = await api.sale.list.query();

  return (
    <div>
      <div className="flex justify-between">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Ventas
        </h3>

        <Button asChild variant="secondary">
          <Link href="/sales/create">Crear venta</Link>
        </Button>
      </div>

      <div className="mt-4">
        <DataTable columns={columns} data={sales} />
      </div>
    </div>
  );
};

export default SalesPage;
