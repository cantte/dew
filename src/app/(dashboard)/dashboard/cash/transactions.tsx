'use client'

import { Badge } from '~/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { ScrollArea } from '~/components/ui/scroll-area'
import { type RouterOutputs } from '~/trpc/shared'

type Props = {
  transactions: RouterOutputs['cashRegister']['transactions']['list']
}

const CashRegisterTransactions = ({ transactions }: Props) => {
  return (
    <div className="flex grow flex-col space-y-4 overflow-hidden">
      {transactions.length === 0 && (
        <div className="text-center">
          <p className="text-xl text-muted-foreground">
            No hay transacciones para mostrar.
          </p>
        </div>
      )}

      <ScrollArea className="grow">
        {transactions.map((transaction) => {
          return (
            <Card key={transaction.id} className="mb-2 shadow-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 px-6 pb-1 pt-2">
                <CardTitle className="text-2xl font-bold">
                  {Intl.NumberFormat('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                  }).format(transaction.amount)}
                </CardTitle>

                <Badge
                  variant={
                    transaction.type === 'IN' ? 'success' : 'destructive'
                  }
                >
                  {transaction.type === 'IN' ? 'Ingreso' : 'Egreso'}
                </Badge>
              </CardHeader>
              <CardContent className="px-6 pb-2">
                <div className="text-sm text-muted-foreground">
                  {Intl.DateTimeFormat('es-CO', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  }).format(new Date(transaction.createdAt))}
                </div>

                <div className="text-sm text-muted-foreground">
                  <Badge variant="secondary" className="mt-2">
                    {transaction.user.name}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </ScrollArea>
    </div>
  )
}

export default CashRegisterTransactions
