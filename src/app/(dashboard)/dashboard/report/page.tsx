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
  MonthlySalesOverview,
  MonthlySalesOverviewFallback,
} from '~/components/sales/monthly-overview'
import {
  YearlySalesOverview,
  YearlySalesOverviewFallback,
} from '~/components/sales/yearly-overview'
import {
  YearlySalesReport,
  YearlySalesReportFallback,
} from '~/components/sales/yearly-report'
import { Label } from '~/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { formatToMonthName } from '~/text/format'

export default function ReportPage() {
  const today = new Date()

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Reporte anual</Label>

        <Select defaultValue={today.getFullYear().toString()}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Seleccionar año" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={today.getFullYear().toString()}>
              {today.getFullYear().toString()}
            </SelectItem>
            <SelectItem value="2020">2020</SelectItem>
            <SelectItem value="2019">2019</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Suspense fallback={<YearlySalesOverviewFallback />}>
        <YearlySalesOverview />
      </Suspense>

      <div className="grid gap-2 grid-cols-1">
        <Suspense fallback={<YearlySalesReportFallback />}>
          <YearlySalesReport />
        </Suspense>
      </div>

      <Suspense fallback={<MostSoldProductsFallback />}>
        <MostSoldProducts />
      </Suspense>

      <div className="space-y-2">
        <Label>Reporte mensual</Label>

        <Select defaultValue={formatToMonthName('es-CO', today)}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Seleccionar un mes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={formatToMonthName('es-CO', today)}>
              {formatToMonthName('es-CO', today)}
            </SelectItem>
            <SelectItem value="2">Febrero</SelectItem>
            <SelectItem value="3">Marzo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Suspense fallback={<MonthlySalesOverviewFallback />}>
        <MonthlySalesOverview />
      </Suspense>

      <Suspense fallback={<SalesReportFallback />}>
        <SalesReport />
      </Suspense>

      <Suspense fallback={<MostSoldProductsFallback />}>
        <MostSoldProducts />
      </Suspense>
    </div>
  )
}
