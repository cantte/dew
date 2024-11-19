import { YearlyReportChart } from '~/components/sales/yearly-report.chart'
import { Skeleton } from '~/components/ui/skeleton'
import { formatToMonthName } from '~/text/format'
import { api } from '~/trpc/server'

type Props = {
  year: number
}

export const YearlySalesReport = async ({ year }: Props) => {
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

  const report = await api.sale.yearlyReport({
    year,
  })

  if (!report) {
    return null
  }

  const data = report.map((row) => ({
    month: formatToMonthName('es-CO', row.date),
    amount: row.amount,
    profit: row.profit,
  }))

  return (
    <div className="grid w-full rounded border p-2">
      <YearlyReportChart data={data} />
    </div>
  )
}

export const YearlySalesReportFallback = () => {
  return <Skeleton className="h-64 w-full" />
}
