import CreateEmployeeForm from '~/app/(dashboard)/dashboard/employees/create/form'
import BackButton from '~/components/back-button'
import NotEnoughPermissions from '~/components/not-enough-permissions'
import NotFoundStoreAlert from '~/components/stores/not-found.alert'
import { api } from '~/trpc/server'

export default async function CreateEmployeePage() {
  const store = await api.store.findCurrent()

  if (!store) {
    return <NotFoundStoreAlert />
  }

  const hasPermissions = await api.rbac.checkPermissions({
    permissions: ['employee:create'],
  })

  if (!hasPermissions) {
    return <NotEnoughPermissions />
  }

  return (
    <div className="flex flex-col items-start space-y-4">
      <BackButton />

      <CreateEmployeeForm store={store} />
    </div>
  )
}
