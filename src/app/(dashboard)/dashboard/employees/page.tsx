import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { columns } from '~/app/(dashboard)/dashboard/employees/columns'
import EmployeeDataTable from '~/app/(dashboard)/dashboard/employees/data-table'
import NotEnoughPermissions from '~/components/not-enough-permissions'
import NotFoundStoreAlert from '~/components/stores/not-found.alert'
import { Button } from '~/components/ui/button'
import { api } from '~/trpc/server'

const EmployeesPage = async () => {
  const store = await api.store.findCurrent()

  if (!store) {
    return <NotFoundStoreAlert />
  }

  const hasPermissions = await api.rbac.checkPermissions({
    permissions: ['employee:view'],
  })

  if (!hasPermissions) {
    return <NotEnoughPermissions />
  }

  const employees = await api.employee.byStore({
    storeId: store.id,
  })

  const canCreateEmployee = await api.rbac.checkPermissions({
    permissions: ['employee:create'],
  })

  return (
    <div className="grid gap-4">
      <div>
        {canCreateEmployee && (
          <Button asChild>
            <Link href="/dashboard/employees/create">
              <PlusCircle />
              Registrar empleado
            </Link>
          </Button>
        )}
      </div>

      <EmployeeDataTable
        columns={columns}
        data={employees}
        storeId={store.id}
      />
    </div>
  )
}

export default EmployeesPage
