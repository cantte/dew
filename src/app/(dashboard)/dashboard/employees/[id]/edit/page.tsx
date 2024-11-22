import { unstable_noStore as noStore } from 'next/cache'
import { notFound } from 'next/navigation'
import { EditEmployeeForm } from '~/app/(dashboard)/dashboard/employees/[id]/edit/form'
import BackButton from '~/components/back-button'
import NotEnoughPermissions from '~/components/not-enough-permissions'
import NotFoundStoreAlert from '~/components/stores/not-found.alert'
import { api } from '~/trpc/server'

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function EditEmployeePage(props: Readonly<Props>) {
  const params = await props.params
  noStore()

  const store = await api.store.findCurrent()

  if (!store) {
    return <NotFoundStoreAlert />
  }

  const hasPermissions = await api.rbac.checkPermissions({
    permissions: ['employee:update', 'employee:view'],
  })

  if (!hasPermissions) {
    return <NotEnoughPermissions />
  }

  const employee = await api.employee.findById({
    code: params.id,
  })

  if (!employee) {
    return notFound()
  }

  return (
    <div className="flex flex-col items-start space-y-4">
      <BackButton />

      <EditEmployeeForm employee={employee} store={store} />
    </div>
  )
}
