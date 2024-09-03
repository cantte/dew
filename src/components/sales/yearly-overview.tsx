import { endOfYear, startOfYear } from 'date-fns'
import {
  SalesOverview,
  SalesOverviewFallback,
} from '~/components/sales/overview'
import { api } from '~/trpc/server'

type Props = {
  year: number
}

export const YearlySalesOverview = async ({ year }: Props) => {
  const store = await api.store.findCurrent()
  if (!store) {
    return null
  }

  const overviewDate = new Date(year, 0, 1)
  const from = startOfYear(overviewDate)
  const to = endOfYear(overviewDate)

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

export const YearlySalesOverviewFallback = () => {
  return <SalesOverviewFallback />
}
