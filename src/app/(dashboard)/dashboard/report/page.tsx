import { Suspense } from 'react'
import {
  GeneralOverview,
  GeneralOverviewFallback,
} from '~/components/dashboard/general-overview'
import {
  MostSoldProducts,
  MostSoldProductsFallback,
} from '~/components/dashboard/most-sold-products'
import {
  SalesReport,
  SalesReportFallback,
} from '~/components/dashboard/sales-report'

export default function ReportPage() {
  return (
    <div className="space-y-4">
      <Suspense fallback={<GeneralOverviewFallback />}>
        <GeneralOverview />
      </Suspense>

      <div className="space-y-2">
        <span className="font-semibold tracking-tight">Ventas del mes</span>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
          <Suspense fallback={<SalesReportFallback />}>
            <SalesReport />
          </Suspense>
        </div>
      </div>

      <Suspense fallback={<MostSoldProductsFallback />}>
        <MostSoldProducts />
      </Suspense>
    </div>
  )
}
