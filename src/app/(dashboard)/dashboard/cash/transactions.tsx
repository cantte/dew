'use client'

import { Calendar, User } from 'lucide-react'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { ScrollArea } from '~/components/ui/scroll-area'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip'
import type { RouterOutputs } from '~/trpc/shared'

type Props = {
  transactions: RouterOutputs['cashRegister']['transactions']['list']
}

const CashRegisterTransactions = ({ transactions }: Props) => {
  return (
    <div className="flex grow flex-col space-y-4 overflow-hidden">
      {transactions.length === 0 && (
        <div className="text-center">
          <p className="text-muted-foreground text-xl">
            No hay transacciones para mostrar.
          </p>
        </div>
      )}

      <ScrollArea className="grow">
        {transactions.map((transaction) => {
          return (
            <Card key={transaction.id} className="mb-2 rounded shadow-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 px-6 pt-2 pb-1">
                <CardTitle className="font-bold text-xl">
                  {Intl.NumberFormat('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                  }).format(transaction.amount)}
                </CardTitle>

                <Badge
                  variant={
                    transaction.type === 'in' ? 'success' : 'destructive'
                  }
                >
                  {transaction.type === 'in' ? 'Ingreso' : 'Egreso'}
                </Badge>
              </CardHeader>
              <CardContent className="px-6 pb-2">
                <TooltipProvider>
                  <div className="grid gap-1.5">
                    <div className="flex items-center">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Calendar className="mr-1 inline-block h-4 w-4" />
                        </TooltipTrigger>

                        <TooltipContent>
                          <span>Fecha de la transacción</span>
                        </TooltipContent>
                      </Tooltip>
                      <span className="text-muted-foreground text-sm">
                        {Intl.DateTimeFormat('es-CO', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        }).format(new Date(transaction.createdAt))}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <User className="mr-1 inline-block h-4 w-4" />
                        </TooltipTrigger>

                        <TooltipContent>
                          <span>Empleado que realizó la transacción</span>
                        </TooltipContent>
                      </Tooltip>
                      <span className="text-muted-foreground text-sm">
                        {transaction.employee}
                      </span>
                    </div>
                  </div>
                </TooltipProvider>
              </CardContent>
            </Card>
          )
        })}
      </ScrollArea>
    </div>
  )
}

export default CashRegisterTransactions
