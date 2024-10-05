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

  const amountReport = report.map((row) => ({
    total: row.amount,
    month: row.date.getMonth(),
    monthName: formatToMonthName('es-CO', row.date),
  }))

  const profitReport = report.map((row) => ({
    total: row.profit,
    month: row.date.getMonth(),
    monthName: formatToMonthName('es-CO', row.date),
  }))

  // Group by month and build and array of objects with the total amount and profit for each month of the year
  const data = Array.from({ length: 12 }, (_, i) => {
    const month = i
    const amount = amountReport.find((row) => row.month === month)?.total ?? 0
    const profit = profitReport.find((row) => row.month === month)?.total ?? 0

    return {
      month: formatToMonthName('es-CO', new Date(2021, month)),
      amount,
      profit,
    }
  })

  return (
    <div className="grid w-full rounded border p-2">
      <YearlyReportChart data={data} />
    </div>
  )
}

export const YearlySalesReportFallback = () => {
  return <Skeleton className="h-64 w-full" />
}
