import { endOfMonth, startOfMonth } from 'date-fns'
import {
  SalesOverview,
  SalesOverviewFallback,
} from '~/components/sales/overview'
import { api } from '~/trpc/server'

type Props = {
  month: number
  year: number
}

export const MonthlySalesOverview = async ({ month, year }: Props) => {
  const store = await api.store.findCurrent()
  if (!store) {
    return null
  }

  const today = new Date(year, month - 1, 1)
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
      amount={overview.amount}
      profit={overview.profit}
    />
  )
}

export const MonthlySalesOverviewFallback = () => {
  return <SalesOverviewFallback />
}
