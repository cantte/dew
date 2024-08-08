'use client'

import { PDFDownloadLink } from '@react-pdf/renderer'
import { Printer } from 'lucide-react'
import { useMemo } from 'react'
import { InvoicePDFTemplate } from '~/components/pdf/invoice-template'
import { SaleOrderItems } from '~/components/sale-order-items'
import { Tooltip } from '~/components/tooltip'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { paymentMethods, saleStatuses } from '~/constants'
import {
  formatToCurrency,
  formatToDateWithTime,
  formatToNumber,
} from '~/text/format'
import type { RouterOutputs } from '~/trpc/shared'

type Props = {
  sale: NonNullable<RouterOutputs['sale']['find']>
}

export const SaleDetail = ({ sale }: Props) => {
  // biome-ignore lint/correctness/useExhaustiveDependencies: not needed
  const templateProps = useMemo(
    () => ({
      id: sale.code,
      date: sale.createdAt.toISOString(),
      customer: {
        name: sale.customer.name,
        id: sale.customer.id,
        phone: sale.customer.phone ?? undefined,
      },
      products: sale.saleItems.map((item) => ({
        id: item.product.code,
        name: item.product.name,
        quantity: item.quantity,
        price: item.salePrice,
      })),
      store: {
        name: sale.store.name,
        nit: sale.store.nit ?? 'N/A',
      },
      employee: {
        name: sale.employee?.name ?? 'No presenta',
      },
      amount: sale.amount,
      payment: sale.payment,
      paymentMethod:
        paymentMethods.find((method) => method.id === sale.paymentMethod)
          ?.label ?? 'No presenta',
    }),
    [],
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Tooltip title="Fecha de creación de la venta">
            <Badge variant="outline">
              {formatToDateWithTime('es-CO', new Date(sale.createdAt))}
            </Badge>
          </Tooltip>

          <Tooltip title="Estado de la venta">
            <Badge
              variant={sale.status === 'cancelled' ? 'destructive' : 'success'}
            >
              {saleStatuses.find((status) => status.id === sale.status)
                ?.label ?? 'Desconocido'}
            </Badge>
          </Tooltip>
        </div>

        <PDFDownloadLink
          fileName={`invoice-${sale.code}`}
          document={<InvoicePDFTemplate {...templateProps} />}
        >
          <Button variant="outline" size="sm" className="h-7 gap-2">
            <Printer className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Imprimir
            </span>
          </Button>
        </PDFDownloadLink>
      </div>
      <div className="flex min-h-[calc(100vh-20rem)] w-full flex-col space-y-4">
        <div className="grid grow grid-cols-1 gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <SaleOrderItems items={sale.saleItems} />
          </div>

          <div className="flex flex-col justify-between gap-4 rounded border p-4">
            <div className="grid gap-4 text-sm">
              <div>
                <Badge variant="outline">{sale.store.name}</Badge>
              </div>

              <div className="grid gap-2">
                <span className="font-semibold leading-none">Vendedor</span>

                <span className="text-muted-foreground">
                  {sale.employee?.name ?? 'No presenta'}
                </span>
              </div>

              <Separator />

              <div className="grid gap-2">
                <span className="font-semibold leading-none">Cliente</span>

                <span className="text-muted-foreground">
                  {sale.customer.name} ({sale.customer.id})
                </span>
              </div>

              <Separator />

              <div className="grid gap-2">
                <span className="font-semibold leading-none">
                  Método de pago
                </span>

                <span className="text-muted-foreground">
                  {paymentMethods.find(
                    (method) => method.id === sale.paymentMethod,
                  )?.label ?? 'No presenta'}
                </span>
              </div>

              <Separator />

              <div className="grid gap-3 text-sm">
                <span className="font-semibold leading-none">Resumen</span>

                <ul className="grid gap-1">
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Productos vendidos
                    </span>
                    <span>
                      {formatToNumber(
                        'es-CO',
                        sale.saleItems
                          .map((item) => item.quantity)
                          .reduce((acc, curr) => acc + curr, 0),
                      )}
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total</span>
                    <span>{formatToCurrency('es-CO', sale.amount)}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Pago recibido</span>
                    <span>{formatToCurrency('es-CO', sale.payment)}</span>
                  </li>
                  {sale.payment - sale.amount > 0 && (
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Cambio</span>
                      <span>
                        {formatToCurrency('es-CO', sale.payment - sale.amount)}
                      </span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
