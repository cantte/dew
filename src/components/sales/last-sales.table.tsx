import { EyeIcon } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Skeleton } from '~/components/ui/skeleton'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '~/components/ui/table'
import { saleStatuses } from '~/constants'
import { formatToCurrency, formatToDateWithTime } from '~/text/format'
import { api } from '~/trpc/server'

export const LastSales = async () => {
  const lastSales = await api.sale.lastSales()

  return (
    <div className="grid grid-cols-1 gap-2">
      <span className="font-medium tracking-tight">Últimas ventas</span>
      <div>
        {lastSales.length > 0 ? (
          <div className="rounded-md border p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {lastSales.map((sale) => (
                  <TableRow key={sale.code}>
                    <TableCell>{sale.customer}</TableCell>
                    <TableCell>
                      {formatToCurrency('es-CO', sale.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          sale.status === 'paid'
                            ? 'success'
                            : sale.status === 'cancelled'
                              ? 'destructive'
                              : 'default'
                        }
                      >
                        {saleStatuses.find((s) => s.id === sale.status)
                          ?.label ?? 'Desconocido'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {formatToDateWithTime('es-CO', sale.createdAt)}
                    </TableCell>
                    <TableCell>
                        <Button variant='ghost' size='icon' asChild>
                            <Link href={`/dashboard/sales/${sale.code}`}>
                            <EyeIcon className='size-5 text-muted-foreground'/>
                            </Link>
                        </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <h3 className="font-semibold text-2xl">No hay ventas</h3>
            <p className="text-gray-500">No tiene ventas registradas</p>
          </div>
        )}
      </div>
    </div>
  )
}

export const LastSalesFallback = () => {
  return (
    <div className="grid grid-cols-1 gap-2">
      <span className="font-semibold tracking-tight">Últimas ventas</span>
      <Skeleton className="h-32 w-full" />
    </div>
  )
}
