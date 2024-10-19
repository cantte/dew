import { EyeIcon } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
import CreateSaleButton from '~/app/(dashboard)/dashboard/sales/create-button'
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
      <h3 className="scroll-m-20 font-semibold text-2xl tracking-tight">
        Últimas ventas
      </h3>

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
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/sales/${sale.code}`}>
                          <EyeIcon className="size-5 text-muted-foreground" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4">
            <span className="text-2xl text-muted-foreground">
              No tiene ventas registradas
            </span>

            <Suspense fallback={<Skeleton className="h-8 w-24" />}>
              <CreateSaleButton />
            </Suspense>
          </div>
        )}
      </div>
    </div>
  )
}

export const LastSalesFallback = () => {
  const rows = Array.from({ length: 5 }).map((_, i) => (
    <TableRow key={i}>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableCell key={i}>
          <Skeleton className="h-6 w-32" />
        </TableCell>
      ))}
    </TableRow>
  ))

  return (
    <div className="grid grid-cols-1 gap-2">
      <h3 className="scroll-m-20 font-semibold text-2xl tracking-tight">
        Últimas ventas
      </h3>

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

          <TableBody>{rows}</TableBody>
        </Table>
      </div>
    </div>
  )
}
