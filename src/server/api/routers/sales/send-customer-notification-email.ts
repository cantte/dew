import { renderToBuffer } from '@react-pdf/renderer'
import type { TypeOf } from 'zod'
import { InvoicePDFTemplate } from '~/components/pdf/invoice-template'
import { NewSaleCustomerEmail } from '~/emails/new-sale'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import findSale from '~/server/api/routers/sales/find'
import type { findSaleInput } from '~/server/api/schemas/sales'
import resend from '~/server/email/resend'

type Options = {
  ctx: TRPCAuthedContext
  input: TypeOf<typeof findSaleInput>
}

export const sendSaleCustomerNotificationEmail = async ({
  ctx,
  input,
}: Options) => {
  const sale = await findSale({ ctx, input })

  if (!sale) {
    throw new Error('Sale not found')
  }

  if (!sale.customer.email) {
    return
  }

  // today's date UTC-5
  const today = new Date()
  today.setHours(today.getHours() - 5)

  const fileStream = await renderToBuffer(
    InvoicePDFTemplate({
      id: sale.code,
      date: Intl.DateTimeFormat('es-CO', {
        dateStyle: 'full',
        timeStyle: 'short',
      }).format(today),
      customer: {
        ...sale.customer,
        phone: sale.customer.phone ?? undefined,
      },
      store: {
        ...sale.store,
        nit: sale.store.nit ?? 'No presenta',
      },
      products: sale.saleItems.map((item) => ({
        id: item.product.code,
        name: item.product.name ?? 'No presenta',
        quantity: item.quantity,
        price: item.salePrice,
      })),
      total: sale.amount,
    }),
  )

  await resend.emails.send({
    from: process.env.RESEND_EMAIL!,
    to: sale.customer.email,
    subject: 'Nueva venta registrada',
    react: NewSaleCustomerEmail({
      name: sale.customer.name,
      total: sale.amount,
      products: sale.saleItems.reduce((acc, item) => acc + item.quantity, 0),
      date: today,
      url: process.env.NEXT_PUBLIC_URL
        ? `${process.env.NEXT_PUBLIC_URL}/sales/c/${sale.code}`
        : `http://localhost:3000/sales/c/${sale.code}`,
      store: sale.store.name,
    }),
    attachments: [
      {
        filename: `invoice-${sale.code}.pdf`,
        content: fileStream,
      },
    ],
  })
}
