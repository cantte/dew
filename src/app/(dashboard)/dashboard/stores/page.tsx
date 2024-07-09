import { columns } from '~/app/(dashboard)/dashboard/stores/columns'
import StoreDataTable from '~/app/(dashboard)/dashboard/stores/data-table'
import NotEnoughPermissions from '~/components/not-enough-permissions'
import { api } from '~/trpc/server'

const StoresPage = async () => {
  const hasPermissions = await api.rbac.checkPermissions({
    permissions: ['store:view'],
  })

  if (!hasPermissions) {
    return <NotEnoughPermissions />
  }

  const stores = await api.store.list()

  return (
    <div className="grid gap-4">
      <h3 className="scroll-m-20 font-semibold text-xl tracking-tight">
        Tiendas
      </h3>

      <StoreDataTable columns={columns} data={stores} />
    </div>
  )
}

export default StoresPage
