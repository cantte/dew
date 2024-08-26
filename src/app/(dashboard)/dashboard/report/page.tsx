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
import { api } from '~/trpc/server'

type Props = {
  searchParams?: { [key: string]: string | string[] | undefined }
}

export default async function ReportPage({ searchParams }: Props) {
  const today = new Date()

  if (!searchParams || !searchParams.year || !searchParams.month) {
    return redirect(
      `/dashboard/report?year=${today.getFullYear()}&month=${today.getMonth() + 1}`,
    )
  }

  const currentYear = searchParams.year as string

  const selectableYears = await api.sale.selectableYears()
  const selectableMonths = await api.sale.selectableMonths({
    year: Number(currentYear),
  })

  return (
    <div className="space-y-4">
      <SelectYear selectableYears={selectableYears} />

      <Suspense fallback={<YearlySalesOverviewFallback />}>
        <YearlySalesOverview />
      </Suspense>

      <div className="grid gap-2 grid-cols-1">
        <Suspense fallback={<YearlySalesReportFallback />}>
          <YearlySalesReport />
        </Suspense>
      </div>

      <SelectMonth selectableMonths={selectableMonths} />

      <Suspense fallback={<MonthlySalesOverviewFallback />}>
        <MonthlySalesOverview />
      </Suspense>

      <Suspense fallback={<MonthlySalesReportFallback />}>
        <MonthlySalesReport />
      </Suspense>

      <Suspense fallback={<MostSoldProductsFallback />}>
        <MostSoldProducts />
      </Suspense>
    </div>
  )
}
