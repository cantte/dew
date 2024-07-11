import { eq } from 'drizzle-orm'
import type { TypeOf } from 'zod'
import { orderStatus } from '~/constants'
import { NewOrderStatusEmail } from '~/emails/new-order-status'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import type { byOrderIdInput } from '~/server/api/schemas/orders'
import { customers, orders, stores } from '~/server/db/schema'
import resend from '~/server/email/resend'

type Options = {
  ctx: TRPCAuthedContext
  input: TypeOf<typeof byOrderIdInput>
}

export const notifyOrderStatus = async ({ ctx, input }: Options) => {
  const [order] = await ctx.db
    .select({
      id: orders.id,
      status: orders.status,
      customer: customers.name,
      customerEmail: customers.email,
      store: stores.name,
    })
    .from(orders)
    .innerJoin(customers, eq(customers.id, orders.customerId))
    .innerJoin(stores, eq(stores.id, orders.storeId))
    .where(eq(orders.id, input.id))
    .limit(1)

  if (!order) {
    return
  }

  if (!order.customerEmail) {
    return
  }

  const status =
    orderStatus.find((s) => s.id === order.status)?.label ?? 'Desconocido'

  await resend.emails.send({
    from: process.env.RESEND_EMAIL!,
    to: order.customerEmail,
    subject: 'Estado de la orden actualizado',
    react: NewOrderStatusEmail({
      name: order.customer,
      status: status,
      date: new Date(),
      url: process.env.NEXT_PUBLIC_URL
        ? `${process.env.NEXT_PUBLIC_URL}/orders/c/${order.id}`
        : `http://localhost:3000/orders/c/${order.id}`,
      store: order.store,
    }),
  })
}
