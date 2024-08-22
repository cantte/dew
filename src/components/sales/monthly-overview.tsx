import { endOfMonth, startOfMonth } from 'date-fns'
import {
  SalesOverview,
  SalesOverviewFallback,
} from '~/components/sales/overview'
import { api } from '~/trpc/server'

export const MonthlySalesOverview = async () => {
  const store = await api.store.findCurrent()
  if (!store) {
    return null
  }

  const today = new Date()
  const from = startOfMonth(today)
  const to = endOfMonth(today)

  const overview = await api.sale.overview({
    from,
    to,
    storeId: store.id,
  })

  return (
    <SalesOverview
      sales={overview.sales}
      products={overview.products}
      amount={overview.revenue}
      profit={overview.revenue}
    />
  )
}

export const MonthlySalesOverviewFallback = () => {
  return <SalesOverviewFallback />
}
