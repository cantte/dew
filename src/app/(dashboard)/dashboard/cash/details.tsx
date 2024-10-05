'use client'

import { endOfMonth, isSameMonth, startOfMonth } from 'date-fns'
import { Calendar, CalendarClock, User } from 'lucide-react'
import { useState } from 'react'
import type {
  DateRange as DateRangeType,
  SelectRangeEventHandler,
} from 'react-day-picker'
import CashRegisterTransactions from '~/app/(dashboard)/dashboard/cash/transactions'
import DateRange from '~/components/date-range'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Skeleton } from '~/components/ui/skeleton'
import uuid from '~/lib/uuid'
import { api } from '~/trpc/react'

type Props = {
  cashRegisterId: string
}

const CashRegisterDetails = ({ cashRegisterId }: Props) => {
  const today = new Date()
  const thisMonth = {
    from: startOfMonth(today),
    to: endOfMonth(today),
  }

  const [selected, setSelected] = useState<DateRangeType>(thisMonth)

  const { data: transactions, isLoading } =
    api.cashRegister.transactions.list.useQuery({
      cashRegisterId,
      from: selected.from!,
      to: selected.to!,
    })

  const handleSelectedRange: SelectRangeEventHandler = (range) => {
    if (!range) {
      return
    }

    setSelected(range)
  }

  const isThisMonth =
    isSameMonth(selected.from!, selected.to!) &&
    isSameMonth(selected.from!, thisMonth.from)

  const resetSelectedRange = () => {
    setSelected(thisMonth)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-1">
        <h2 className="font-semibold text-xl tracking-tight">Movimientos</h2>

        <div className="flex items-center space-x-2">
          <DateRange selected={selected} onSelectRange={handleSelectedRange} />

          {!isThisMonth && (
            <Button variant="ghost" onClick={resetSelectedRange}>
              <CalendarClock className="mr-2 h-4 w-4" />
              <span>Ver movimientos de este mes</span>
            </Button>
          )}
        </div>
      </div>

      {isLoading && <CashRegisterDetailsFallback />}

      {!isLoading && transactions && (
        <CashRegisterTransactions transactions={transactions} />
      )}
    </div>
  )
}

const FALLBACK_ITEMS = 3

const CashRegisterDetailsFallback = () => {
  return (
    <div className="grid gap-2">
      {Array.from({ length: FALLBACK_ITEMS }).map((_, index) => (
        <Card
          key={`fallback-item-${uuid()}`}
          className="mb-2 rounded shadow-none"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 px-6 pt-2 pb-1">
            <CardTitle className="font-bold text-xl">
              <Skeleton className="h-6 w-32" />
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-2">
            <div className="grid gap-1.5">
              <div className="flex items-center">
                <Calendar className="mr-1 inline-block h-4 w-4" />
                <span className="text-muted-foreground text-sm">
                  <Skeleton className="h-4 w-32" />
                </span>
              </div>

              <div className="flex items-center">
                <User className="mr-1 inline-block h-4 w-4" />
                <span className="text-muted-foreground text-sm">
                  <Skeleton className="h-4 w-32" />
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default CashRegisterDetails
