import { endOfMonth, startOfMonth } from 'date-fns'
import CashRegisterTransactions from '~/app/(dashboard)/dashboard/cash/transactions'
import { api } from '~/trpc/server'

type Props = {
  cashRegisterId: string
}

const CashRegisterDetails = async ({ cashRegisterId }: Props) => {
  const today = new Date()
  const transactions = await api.cashRegister.transactions.list({
    cashRegisterId: cashRegisterId,
    from: startOfMonth(today),
    to: endOfMonth(today),
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-1">
        <h2 className="font-semibold text-xl tracking-tight">Movimientos</h2>
        <span className="text-muted-foreground text-sm">
          Movimientos del mes actual
        </span>
      </div>

      <CashRegisterTransactions transactions={transactions} />
    </div>
  )
}

export default CashRegisterDetails
