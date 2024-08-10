import { api } from '~/trpc/server'

export const YearlySalesReport = async () => {
  const store = await api.store.findCurrent()
  if (!store) {
    return null
  }

  const hasPermission = await api.rbac.checkPermissions({
    permissions: ['sale:view'],
  })

  if (!hasPermission) {
    return null
  }

  const report = await api.sale.yearlyReport()

  if (!report) {
    return null
  }

  return <div>{JSON.stringify(report)}</div>
}
