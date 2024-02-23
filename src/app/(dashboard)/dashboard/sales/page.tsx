import Link from "next/link";
import { columns } from "~/app/(dashboard)/dashboard/sales/columns";
import SalesDataTable from "~/app/(dashboard)/dashboard/sales/data-table";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/server";

const SalesPage = async () => {
  const sales = await api.sale.list.query();

  return (
    <div>
      <div className="flex justify-between">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Ventas
        </h3>

        <Button asChild>
          <Link href="/sales/create">Crear venta</Link>
        </Button>
      </div>

      <div className="mt-4">
        <SalesDataTable columns={columns} data={sales} />
      </div>
    </div>
  );
};

export default SalesPage;
