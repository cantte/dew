import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import {
  MostSoldProducts,
  MostSoldProductsFallback,
} from '~/components/dashboard/most-sold-products'
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
import { Label } from '~/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { formatToMonthName } from '~/text/format'

type Props = {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function ReportPage({ searchParams }: Props) {
  const today = new Date()

  if (!searchParams || !searchParams.year || !searchParams.month) {
    return redirect(`/dashboard/report?year=${today.getFullYear()}&month=${today.getMonth() + 1}`)
  }

  const currentYear = searchParams.year as string

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Reporte anual</Label>

        <Select defaultValue={currentYear}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Seleccionar año" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={currentYear}>
              {currentYear}
            </SelectItem>
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
          </SelectContent>
        </Select>
      </div>

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
