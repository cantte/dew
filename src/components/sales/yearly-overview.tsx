import { endOfYear, startOfYear } from 'date-fns'
import {
  SalesOverview,
  SalesOverviewFallback,
} from '~/components/sales/overview'
import { api } from '~/trpc/server'

export const YearlySalesOverview = async () => {
  const store = await api.store.findCurrent()
  if (!store) {
    return null
  }

  const today = new Date()
  const from = startOfYear(today)
  const to = endOfYear(today)

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

export const YearlySalesOverviewFallback = () => {
  return <SalesOverviewFallback />
}
