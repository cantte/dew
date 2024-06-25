'use client'

import { endOfDay, startOfDay } from 'date-fns'
import { Fragment, useState } from 'react'
import type { DateRange } from 'react-day-picker'
import CashRegisterActions from '~/app/(dashboard)/dashboard/cash/actions'
import CashRegisterTransactions from '~/app/(dashboard)/dashboard/cash/transactions'
import DateRangeFilter from '~/components/date-range-filter'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { api } from '~/trpc/react'
import type { RouterOutputs } from '~/trpc/shared'

type Props = {
  transactions: RouterOutputs['cashRegister']['transactions']['list']
  cashRegisterId: string
}

const CashRegisterDetails = ({ transactions, cashRegisterId }: Props) => {
  const today = new Date()
  const [date, setDate] = useState<DateRange | undefined>({
    from: startOfDay(today),
    to: endOfDay(today),
  })

  const { data: allTransactions } = api.cashRegister.transactions.list.useQuery(
    {
      cashRegisterId,
      from: date?.from ?? startOfDay(today),
      to: date?.to ?? endOfDay(today),
    },
    {
      initialData: transactions,
    },
  )

  const inAmount = allTransactions
    .filter((t) => t.type === 'IN')
    .reduce((acc, t) => acc + t.amount, 0)

  const outAmount = allTransactions
    .filter((t) => t.type === 'OUT')
    .reduce((acc, t) => acc + t.amount, 0)

  return (
    <Fragment>
      <DateRangeFilter selected={date} onSelectRange={setDate} />

      <CashRegisterActions cashRegisterId={cashRegisterId} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success-text">
              {Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
              }).format(+inAmount)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Egresos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
              }).format(+outAmount)}
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-lg font-semibold tracking-tight">Movimientos</h2>

      <CashRegisterTransactions transactions={allTransactions} />
    </Fragment>
  )
}

export default CashRegisterDetails
