import { InfoCircledIcon } from '@radix-ui/react-icons'
import { endOfMonth, startOfMonth } from 'date-fns'
import CashRegisterDetails from '~/app/(dashboard)/dashboard/cash/details'
import EnableCash from '~/app/(dashboard)/dashboard/cash/enable-cash'
import NotEnoughPermissions from '~/components/not-enough-permissions'
import NotFoundStoreAlert from '~/components/stores/not-found.alert'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { api } from '~/trpc/server'

const CashRegisterPage = async () => {
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
        <h3 className='scroll-m-20 font-semibold text-2xl tracking-tight'>
          Caja registradora
        </h3>

        <Alert>
          <InfoCircledIcon className="h-4 w-4 text-muted-foreground" />
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

  const today = new Date()
  const transactions = await api.cashRegister.transactions.list({
    cashRegisterId: cashRegister.id,
    from: startOfMonth(today),
    to: endOfMonth(today),
  })

  return (
    <div className="flex h-[calc(100vh-7.5rem)] flex-col space-y-4">
      <Card className="border-dashed shadow-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className='font-medium text-sm'>
            Saldo de la caja registradora
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='font-bold text-2xl'>
            {Intl.NumberFormat('es-CO', {
              style: 'currency',
              currency: 'COP',
            }).format(+cashRegister.amount)}
          </div>
        </CardContent>
      </Card>

      <CashRegisterDetails
        transactions={transactions}
        cashRegisterId={cashRegister.id}
      />
    </div>
  )
}

export default CashRegisterPage
