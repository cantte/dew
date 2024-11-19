import { endOfDay, startOfDay } from 'date-fns'
import {
  SalesOverview,
  SalesOverviewFallback,
} from '~/components/sales/overview'
import { api } from '~/trpc/server'

export const DailySalesOverview = async () => {
  const store = await api.store.findCurrent()
  if (!store) {
    return null
  }

  const today = new Date()
  const from = startOfDay(today)
  const to = endOfDay(today)

  const overview = await api.sale.overview({
    from,
    to,
    storeId: store.id,
  })

  return (
    <SalesOverview
      sales={overview.sales}
      products={overview.products}
      amount={overview.amount}
      profit={overview.profit}
    />
  )
}

export const DailySalesOverviewFallback = () => {
  return <SalesOverviewFallback />
}
