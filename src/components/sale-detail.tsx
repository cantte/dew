'use client'

import { Separator } from '~/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { paymentMethods } from '~/constants'
import type { RouterOutputs } from '~/trpc/shared'
import { Badge } from '~/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip'
import { Button } from '~/components/ui/button'
import { Printer } from 'lucide-react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { InvoicePDFTemplate } from '~/components/pdf/invoice-template'
import { useMemo } from 'react'

type Props = {
  sale: NonNullable<RouterOutputs['sale']['find']>
}

const SaleDetail = ({ sale }: Props) => {
  // biome-ignore lint/correctness/useExhaustiveDependencies: not needed
  const templateProps = useMemo(
    () => ({
      id: sale.code,
      date: Intl.DateTimeFormat('es-CO', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      }).format(new Date(sale.createdAt)),
      customer: {
        name: sale.customer?.name ?? 'Mostrador',
        id: sale.customer?.id ?? 'No encontrado',
        phone: sale.customer?.phone ?? undefined,
      },
      products: sale.saleItems.map((item) => ({
        id: item.product?.code ?? 'No encontrado',
        name: item.product?.name ?? 'No encontrado',
        quantity: item.quantity,
        price: item.salePrice,
      })),
      total: sale.amount,
      store: {
        name: sale.store.name,
        nit: sale.store.nit ?? 'No definido',
      },
    }),
    [],
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="outline">
                {Intl.DateTimeFormat('es-CO', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                }).format(new Date(sale.createdAt))}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>Fecha de creación de la venta</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <PDFDownloadLink document={<InvoicePDFTemplate {...templateProps} />}>
          <Button variant="outline" size="sm" className="h-7 gap-1">
            <Printer className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Imprimir
            </span>
          </Button>
        </PDFDownloadLink>
      </div>
      <div className="flex min-h-[calc(100vh-20rem)] w-full flex-col space-y-4">
        <div className="grid grow grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded border p-4 md:col-span-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Precio de venta</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {sale.saleItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.product?.name ?? 'No encontrado'}
                    </TableCell>
                    <TableCell>
                      {Intl.NumberFormat('es-CO').format(item.quantity)}
                    </TableCell>
                    <TableCell>
                      {Intl.NumberFormat('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                      }).format(item.salePrice)}
                    </TableCell>
                    <TableCell>
                      {Intl.NumberFormat('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                      }).format(item.quantity * item.salePrice)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col justify-between gap-4 rounded border p-4">
            <div className="text-sm">
              <div className="grid gap-3">
                <div className="font-semibold">Resumen</div>
                <ul className="grid gap-3">
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Productos vendidos
                    </span>
                    <span>
                      {Intl.NumberFormat('es-CO').format(
                        sale.saleItems.reduce(
                          (acc, item) => acc + item.quantity,
                          0,
                        ),
                      )}
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total</span>
                    <span>
                      {Intl.NumberFormat('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                      }).format(sale.amount)}
                    </span>
                  </li>
                </ul>

                <Separator className="my-2" />

                <div className="font-semibold">Cliente</div>
                <p className="text-muted-foreground">
                  {sale.customer
                    ? `${sale.customer.name} (${sale.customer.id})`
                    : 'Mostrador'}
                </p>

                <Separator className="my-2" />

                <div className="space-y-2">
                  <div className="font-semibold">Método de pago</div>
                  <p className="text-muted-foreground">
                    {paymentMethods.find(
                      (method) => method.id === sale.paymentMethod,
                    )?.label ?? 'Desconocido'}
                  </p>
                </div>

                <ul className="grid gap-3">
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total a pagar</span>
                    <span>
                      {Intl.NumberFormat('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                      }).format(sale.amount)}
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Pago recibido</span>
                    <span>
                      {Intl.NumberFormat('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                      }).format(sale.payment)}
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Cambio</span>
                    <span>
                      {Intl.NumberFormat('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                      }).format(sale.payment - sale.amount)}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SaleDetail
