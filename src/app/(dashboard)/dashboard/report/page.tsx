import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import {
  MostSoldProducts,
  MostSoldProductsFallback,
} from '~/components/dashboard/most-sold-products'
import { SelectMonth } from '~/components/dashboard/select-month'
import { SelectYear } from '~/components/dashboard/select-year'
import {
  MonthlySalesOverview,
  MonthlySalesOverviewFallback,
} from '~/components/sales/monthly-overview'
import {
  MonthlySalesReport,
  MonthlySalesReportFallback,
} from '~/components/sales/monthly-report'
import {
  YearlySalesOverview,
  YearlySalesOverviewFallback,
} from '~/components/sales/yearly-overview'
import {
  YearlySalesReport,
  YearlySalesReportFallback,
} from '~/components/sales/yearly-report'
import NotFoundStoreAlert from '~/components/stores/not-found.alert'
import { api } from '~/trpc/server'

type Props = {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ReportPage(props: Readonly<Props>) {
  const searchParams = await props.searchParams
  const store = await api.store.findCurrent()

  if (!store) {
    return <NotFoundStoreAlert />
  }

  const today = new Date()

  if (!searchParams?.year || !searchParams?.month) {
    return redirect(
      `/dashboard/report?year=${today.getFullYear()}&month=${today.getMonth() + 1}`,
    )
  }

  const currentYear = Number(searchParams.year)
  const currentMonth = Number(searchParams.month)

  const selectableYears = await api.sale.selectableYears()
  const selectableMonths = await api.sale.selectableMonths({
    year: currentYear,
  })

  return (
    <div className="space-y-4">
      <SelectYear selectableYears={selectableYears} />

      <Suspense key={store.id} fallback={<YearlySalesOverviewFallback />}>
        <YearlySalesOverview year={currentYear} />
      </Suspense>

      <div className="grid grid-cols-1 gap-2">
        <Suspense key={store.id} fallback={<YearlySalesReportFallback />}>
          <YearlySalesReport year={currentYear} />
        </Suspense>
      </div>

      <SelectMonth selectableMonths={selectableMonths} />

      <Suspense key={store.id} fallback={<MonthlySalesOverviewFallback />}>
        <MonthlySalesOverview month={currentMonth} year={currentYear} />
      </Suspense>

      <Suspense key={store.id} fallback={<MonthlySalesReportFallback />}>
        <MonthlySalesReport month={currentMonth} year={currentYear} />
      </Suspense>

      <Suspense key={store.id} fallback={<MostSoldProductsFallback />}>
        <MostSoldProducts />
      </Suspense>
    </div>
  )
}
