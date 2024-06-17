import Link from "next/link";
import { columns } from "~/app/(dashboard)/dashboard/employees/columns";
import EmployeeDataTable from "~/app/(dashboard)/dashboard/employees/data-table";
import NotEnoughPermissions from "~/components/not-enough-permissions";
import NotFoundStoreAlert from "~/components/stores/not-found.alert";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/server";

const EmployeesPage = async () => {
  const store = await api.store.findCurrent();

  if (!store) {
    return <NotFoundStoreAlert />;
  }

  const hasPermissions = await api.rbac.checkPermissions({
    permissions: ["employee:view"],
  });

  if (!hasPermissions) {
    return <NotEnoughPermissions />;
  }

  const employees = await api.employee.byStore({
    storeId: store.id,
  });

  return (
    <div>
      <div className="flex justify-between">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Empleados
        </h3>

        <Button asChild>
          <Link href="/employees/create">Crear empleado</Link>
        </Button>
      </div>

      <div className="mt-4">
        <EmployeeDataTable
          columns={columns}
          data={employees}
          storeId={store.id}
        />
      </div>
    </div>
  );
};

export default EmployeesPage;
