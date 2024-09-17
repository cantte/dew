import { Info, TrendingDown, TrendingUp } from 'lucide-react'
import { Suspense } from 'react'
import CashRegisterActions from '~/app/(dashboard)/dashboard/cash/actions'
import CashRegisterDetails from '~/app/(dashboard)/dashboard/cash/details'
import EnableCash from '~/app/(dashboard)/dashboard/cash/enable-cash'
import NotEnoughPermissions from '~/components/not-enough-permissions'
import NotFoundStoreAlert from '~/components/stores/not-found.alert'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Skeleton } from '~/components/ui/skeleton'
import { api } from '~/trpc/server'

export default async function CashRegisterPage() {
  const store = await api.store.findCurrent()

  if (!store) {
    return <NotFoundStoreAlert />
  }

  const hasPermissions = await api.rbac.checkPermissions({
    permissions: ['cash_register:view'],
  })

  if (!hasPermissions) {
    return <NotEnoughPermissions />
  }

  const cashRegister = await api.cashRegister.find({ storeId: store.id })

  if (!cashRegister) {
    const hasPermissions = await api.rbac.checkPermissions({
      permissions: ['cash_register:create'],
    })

    if (!hasPermissions) {
      return <NotEnoughPermissions />
    }

    return (
      <div className="space-y-4">
        <h3 className="scroll-m-20 font-semibold text-2xl tracking-tight">
          Caja registradora
        </h3>

        <Alert>
          <Info className="h-4 w-4 text-muted-foreground" />
          <AlertTitle>Habilitar caja</AlertTitle>
          <AlertDescription>
            Actualmente no tienes esta funcionalidad activa para la tienda
            actual.
            <br />
            <EnableCash storeId={store.id} />
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      <div className="sticky top-0 z-[5] grid gap-4 bg-background/95 pb-4 backdrop-blur supports-backdrop-blur:bg-background/60">
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
                {Intl.NumberFormat('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                }).format(cashRegister.inAmount)}
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
                {Intl.NumberFormat('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                }).format(cashRegister.outAmount)}
              </h3>
            </div>
          </div>
        </div>

        <CashRegisterActions cashRegisterId={cashRegister.id} />
      </div>

      <Suspense fallback={<CashRegisterDetailsFallback />}>
        <CashRegisterDetails cashRegisterId={cashRegister.id} />
      </Suspense>
    </div>
  )
}

const CashRegisterDetailsFallback = () => {
  return (
    <div>
      <Skeleton className="h-8 w-full" />
    </div>
  )
}
