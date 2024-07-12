import { Suspense } from 'react'
import { GeneralOverview } from '~/components/dashboard/general-overview'
import { GeneralReport } from '~/components/dashboard/general-report'
import LowStockProducts from '~/components/dashboard/low-stock-products'
import MostSoldProducts from '~/components/dashboard/most-sold-products'
import OrdersReport from '~/components/dashboard/orders-report'
import SalesReport from '~/components/dashboard/sales-report'
import OrdersOverview from '~/components/orders/overview'
import SalesOverview from '~/components/sales/overview'
import NotFoundStoreAlert from '~/components/stores/not-found.alert'
import { Skeleton } from '~/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { api } from '~/trpc/server'

const DashboardPage = async () => {
  const store = await api.store.findCurrent()
  if (!store) {
    return <NotFoundStoreAlert />
  }

  return (
    <>
      <div className="space-y-2">
        <span className="font-semibold tracking-tight">Reporte general</span>

        <Suspense fallback={<Skeleton className="h-5 w-full max-w-[450px]" />}>
          <GeneralOverview />
        </Suspense>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
          <Suspense fallback={<SalesReportFallback />}>
            <GeneralReport />
          </Suspense>
        </div>
      </div>

      <div className="space-y-2">
        <span className="font-semibold tracking-tight">
          Reporte de ventas y ordenes
        </span>

        <Tabs defaultValue="sales">
          <TabsList>
            <TabsTrigger value="sales">Ventas</TabsTrigger>
            <TabsTrigger value="orders">Ordenes</TabsTrigger>
          </TabsList>
          <TabsContent value="sales">
            <div className="grid gap-4">
              <Suspense
                fallback={<Skeleton className="h-5 w-full max-w-[450px]" />}
              >
                <SalesOverview />
              </Suspense>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
                <Suspense fallback={<SalesReportFallback />}>
                  <SalesReport />
                </Suspense>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <div className="grid gap-4">
              <Suspense
                fallback={<Skeleton className="h-5 w-full max-w-[450px]" />}
              >
                <OrdersOverview />
              </Suspense>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
                <Suspense fallback={<SalesReportFallback />}>
                  <OrdersReport />
                </Suspense>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Suspense fallback={<Skeleton className="h-10 w-full" />}>
        <MostSoldProducts />
      </Suspense>

      <Suspense fallback={<Skeleton className="h-10 w-full" />}>
        <LowStockProducts />
      </Suspense>
    </>
  )
}

const SalesReportFallback = () => {
  return (
    <>
      <Skeleton className="h-[200px] w-full" />
      <Skeleton className="h-[200px] w-full" />
    </>
  )
}

export default DashboardPage
