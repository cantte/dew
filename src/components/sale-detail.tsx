'use client'

import { Separator } from '~/components/ui/separator'
import { paymentMethods } from '~/constants'
import type { RouterOutputs } from '~/trpc/shared'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Printer } from 'lucide-react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { InvoicePDFTemplate } from '~/components/pdf/invoice-template'
import { useMemo } from 'react'
import { SaleOrderItems } from '~/components/sale-order-items'
import {
  formatToCurrency,
  formatToDateWithTime,
  formatToNumber,
} from '~/text/format'
import { Tooltip } from '~/components/tooltip'

type Props = {
  sale: NonNullable<RouterOutputs['sale']['find']>
}

export const SaleDetail = ({ sale }: Props) => {
  // biome-ignore lint/correctness/useExhaustiveDependencies: not needed
  const templateProps = useMemo(
    () => ({
      id: sale.code,
      date: formatToDateWithTime('es-CO', new Date(sale.createdAt)),
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
        <Tooltip title="Fecha de creación de la venta">
          <Badge variant="outline">
            {formatToDateWithTime('es-CO', new Date(sale.createdAt))}
          </Badge>
        </Tooltip>

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
          <div className="md:col-span-2">
            <SaleOrderItems items={sale.saleItems} />
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
                      {formatToNumber('es-CO', sale.saleItems.length)}
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total</span>
                    <span>{formatToCurrency('es-CO', sale.amount)}</span>
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
                    <span>{formatToCurrency('es-CO', sale.amount)}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Pago recibido</span>
                    <span>{formatToCurrency('es-CO', sale.payment)}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Cambio</span>
                    <span>
                      {formatToCurrency('es-CO', sale.payment - sale.amount)}
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
