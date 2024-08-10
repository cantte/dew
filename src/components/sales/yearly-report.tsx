import { BarChartCard } from '~/components/bar-chart-card'
import { Skeleton } from '~/components/ui/skeleton'
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

  const amountReport = report.map((row) => ({
    total: row.amount,
    date: row.date.toISOString(),
  }))

  const profitReport = report.map((row) => ({
    total: row.profit,
    date: row.date.toISOString(),
  }))

  const totalAmount = report.reduce((acc, row) => acc + row.amount, 0)
  const totalProfit = report.reduce((acc, row) => acc + row.profit, 0)

  return (
    <>
      <BarChartCard
        title="Ingresos totales"
        value={totalAmount}
        summary={amountReport}
      />

      <BarChartCard
        title="Ganancias totales"
        value={totalProfit}
        summary={profitReport}
      />
    </>
  )
}

export const YearlySalesReportFallback = () => {
  return (
    <>
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-64 w-full" />
    </>
  )
}
