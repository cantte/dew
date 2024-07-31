import type { TypeOf } from 'zod'
import NewOrderEmail from '~/emails/new-order'
import uuid from '~/lib/uuid'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import findCustomer from '~/server/api/routers/customers/find'
import { makeInventoryAdjustment } from '~/server/api/routers/inventory/make-inventory-adjustment'
import findStore from '~/server/api/routers/stores/find'
import { InventoryAdjustmentType } from '~/server/api/schemas/inventory'
import type { createOrderInput } from '~/server/api/schemas/orders'
import { orderItems, orders } from '~/server/db/schema'
import resend from '~/server/email/resend'

type Options = {
  ctx: TRPCAuthedContext
  input: TypeOf<typeof createOrderInput>
}

const createOrder = async ({ ctx, input }: Options) => {
  await ctx.db.transaction(async (tx) => {
    const id = uuid()

    await tx.insert(orders).values({
      ...input,
      id: id,
      createdBy: ctx.session.user.id,
    })

    const items = input.items.map((item) => ({
      ...item,
      id: uuid(),
      orderId: id,
      createdBy: ctx.session.user.id,
    }))

    await tx.insert(orderItems).values(items)

    const inventoryAdjustmentProducts = items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      type: InventoryAdjustmentType.Out,
    }))

    await makeInventoryAdjustment({
      tx,
      input: {
        storeId: input.storeId,
        userId: ctx.session.user.id,
        products: inventoryAdjustmentProducts,
      },
    })

    const customer = await findCustomer({
      ctx,
      input: { id: input.customerId },
    })

    if (!customer?.email) {
      return
    }

    const store = await findStore({
      ctx,
      input: { id: input.storeId },
    })

    if (!store) {
      return
    }

    await resend.emails.send({
      from: process.env.RESEND_EMAIL!,
      to: customer.email,
      subject: 'Nueva orden registrada',
      react: NewOrderEmail({
        name: customer.name,
        total: input.amount,
        products: input.items.reduce((acc, item) => item.quantity + acc, 0),
        date: new Date(),
        url: process.env.NEXT_PUBLIC_URL
          ? `${process.env.NEXT_PUBLIC_URL}/orders/c/${id}`
          : `http://localhost:3000/orders/c/${id}`,
        store: store.name,
      }),
    })
  })
}

export default createOrder
