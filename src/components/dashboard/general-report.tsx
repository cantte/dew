import { endOfMonth, startOfMonth } from 'date-fns'
import TotalProfit from '~/components/dashboard/total-profit'
import TotalRevenue from '~/components/dashboard/total-revenue'
import { api } from '~/trpc/server'

export const GeneralReport = async () => {
  const store = await api.store.findCurrent()
  if (!store) {
    return null
  }

  const hasPermission = await api.rbac.checkPermissions({
    permissions: ['sale:view', 'order:view'],
  })

  if (!hasPermission) {
    return null
  }

  const today = new Date()
  const from = startOfMonth(today)
  const to = endOfMonth(today)

  const salesReport = await api.sale.report({
    from,
    to,
    storeId: store.id,
  })

  const ordersReport = await api.order.report({
    from,
    to,
    storeId: store.id,
  })

  const revenue = salesReport.totalAmount + ordersReport.totalAmount
  const revenueImprovement =
    salesReport.amountImprovement + ordersReport.amountImprovement
  const revenueData = salesReport.totalAmountPerDay.concat(
    ordersReport.totalAmountPerDay,
  )

  const profit = salesReport.totalProfit + ordersReport.totalProfit
  const profitImprovement =
    salesReport.profitImprovement + ordersReport.profitImprovement
  const profitData = salesReport.totalProfitPerDay.concat(
    ordersReport.totalProfitPerDay,
  )

  return (
    <>
      <TotalRevenue
        revenue={revenue}
        revenueImprovement={revenueImprovement}
        revenueData={revenueData}
      />

      <TotalProfit
        profit={profit}
        profitImprovement={profitImprovement}
        profitData={profitData}
      />
    </>
  )
}
