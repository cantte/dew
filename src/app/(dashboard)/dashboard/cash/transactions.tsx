'use client'

import { Calendar, StickyNote, User } from 'lucide-react'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { ScrollArea } from '~/components/ui/scroll-area'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip'
import { cn } from '~/lib/utils'
import { formatToCurrency } from '~/text/format'
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
                <CardTitle
                  className={cn(
                    'font-bold text-xl',
                    transaction.type === 'in'
                      ? 'text-success'
                      : 'text-destructive',
                  )}
                >
                  {formatToCurrency('es-CO', transaction.amount)}
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
                        <TooltipTrigger className="m-0 flex cursor-text items-center gap-2 p-0 text-muted-foreground">
                          <Calendar className="inline-block h-4 w-4" />
                          <span className="text-sm">
                            {Intl.DateTimeFormat('es-CO', {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            }).format(new Date(transaction.createdAt))}
                          </span>
                        </TooltipTrigger>

                        <TooltipContent>
                          <span>Fecha de la transacción</span>
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    <div className="flex items-center">
                      <Tooltip>
                        <TooltipTrigger className="m-0 flex cursor-text items-center gap-2 p-0 text-muted-foreground">
                          <User className="inline-block h-4 w-4" />
                          <span className="text-muted-foreground text-sm">
                            {transaction.employee}
                          </span>
                        </TooltipTrigger>

                        <TooltipContent>
                          <span>Empleado que realizó la transacción</span>
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    {transaction.observation && (
                      <div className="flex items-center">
                        <Tooltip>
                          <TooltipTrigger className="m-0 flex cursor-text items-center gap-2 p-0 text-muted-foreground">
                            <StickyNote className="inline-block h-4 w-4" />
                            <span className="text-muted-foreground text-sm">
                              {transaction.observation}
                            </span>
                          </TooltipTrigger>

                          <TooltipContent>
                            <span>Observación</span>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    )}
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
