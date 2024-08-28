import { TrendingDown, TrendingUp } from 'lucide-react'
import { Suspense } from 'react'
import {
  DailySalesOverview,
  DailySalesOverviewFallback,
} from '~/components/sales/daily-overview'
import NotFoundStoreAlert from '~/components/stores/not-found.alert'
import { formatToCurrency } from '~/text/format'
import { api } from '~/trpc/server'

export default async function DashboardPage() {
  const store = await api.store.findCurrent()
  if (!store) {
    return <NotFoundStoreAlert />
  }

  const cashRegister = await api.cashRegister.find({ storeId: store.id })

  return (
    <div className="space-y-4">
      <h3 className="scroll-m-20 font-semibold text-2xl tracking-tight">
        Bienvenido
      </h3>

      {cashRegister && (
        <div className="space-y-2">
          <span className="font-medium tracking-tight">
            Estado de caja registradora
          </span>

          <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
            <div className="col-span-1 md:col-span-2">
              <div className="flex flex-col space-y-2 rounded border p-4">
                <p className="font-medium text-muted-foreground text-sm">
                  Saldo actual
                </p>
                <h3 className="font-semibold text-xl leading-none tracking-tight md:text-2xl">
                  {Intl.NumberFormat('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                  }).format(cashRegister.amount)}
                </h3>
              </div>
            </div>

            <div className="col-span-1">
              <div className="flex flex-col space-y-2 rounded border p-4">
                <div className="flex items-center space-x-1">
                  <span className="rounded-full bg-secondary p-1">
                    <TrendingUp className="h-3 w-3 text-success-text" />
                  </span>
                  <p className="font-medium text-muted-foreground text-sm">
                    Ingresos totales
                  </p>
                </div>
                <h3 className="font-semibold text-xl leading-none tracking-tight md:text-2xl">
                  {formatToCurrency('es-CO', cashRegister.inAmount)}
                </h3>
              </div>
            </div>

            <div className="col-span-1">
              <div className="flex flex-col space-y-2 rounded border p-4">
                <div className="flex items-center space-x-1">
                  <span className="rounded-full bg-secondary p-1">
                    <TrendingDown className="h-3 w-3 text-destructive" />
                  </span>
                  <p className="font-medium text-muted-foreground text-sm">
                    Egresos totales
                  </p>
                </div>
                <h3 className="font-semibold text-xl leading-none tracking-tight md:text-2xl">
                  {formatToCurrency('es-CO', cashRegister.outAmount)}
                </h3>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <span className="font-medium tracking-tight">Ventas del día</span>

        <Suspense fallback={<DailySalesOverviewFallback />}>
          <DailySalesOverview />
        </Suspense>
      </div>
    </div>
  )
}
