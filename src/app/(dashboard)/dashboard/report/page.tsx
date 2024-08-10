import { Suspense } from 'react'
import {
  MostSoldProducts,
  MostSoldProductsFallback,
} from '~/components/dashboard/most-sold-products'
import {
  SalesReport,
  SalesReportFallback,
} from '~/components/dashboard/sales-report'
import {
  SalesOverview,
  SalesOverviewFallback,
} from '~/components/sales/overview'
import {
  YearlySalesReport,
  YearlySalesReportFallback,
} from '~/components/sales/yearly-report'

export default function ReportPage() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <span className="font-semibold tracking-tight">Ventas del mes</span>

        <Suspense fallback={<SalesOverviewFallback />}>
          <SalesOverview />
        </Suspense>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
          <Suspense fallback={<SalesReportFallback />}>
            <SalesReport />
          </Suspense>
        </div>
      </div>

      <div className="space-y-2">
        <span className="font-semibold tracking-tight">Ventas del año</span>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
          <Suspense fallback={<YearlySalesReportFallback />}>
            <YearlySalesReport />
          </Suspense>
        </div>
      </div>

      <Suspense fallback={<MostSoldProductsFallback />}>
        <MostSoldProducts />
      </Suspense>
    </div>
  )
}
