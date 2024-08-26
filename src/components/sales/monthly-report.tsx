import { MonthlyReportChart } from '~/components/sales/monthly-report.chart'
import { Skeleton } from '~/components/ui/skeleton'
import { api } from '~/trpc/server'

type Props = {
  month: number
  year: number
}

export const MonthlySalesReport = async ({ month, year }: Props) => {
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

  const report = await api.sale.monthlyReport({
    month,
    year,
  })

  return (
    <div className="w-full p-2 border rounded grid">
      <MonthlyReportChart data={report ?? []} />
    </div>
  )
}

export const MonthlySalesReportFallback = () => {
  return <Skeleton className="h-64 w-full" />
}
