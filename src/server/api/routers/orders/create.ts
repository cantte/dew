import { and, eq } from 'drizzle-orm'
import type { TypeOf } from 'zod'
import NewOrderEmail from '~/emails/new-order'
import uuid from '~/lib/uuid'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import findCustomer from '~/server/api/routers/customers/find'
import findStore from '~/server/api/routers/stores/find'
import type { createOrderInput } from '~/server/api/schemas/orders'
import { inventory, orderItems, orders } from '~/server/db/schema'
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

    const soldProducts = items.map((item) => ({
      id: item.productId,
      quantity: item.quantity,
    }))

    for (const soldProduct of soldProducts) {
      const [productInventory] = await tx
        .select({
          stock: inventory.stock,
          quantity: inventory.quantity,
        })
        .from(inventory)
        .where(
          and(
            eq(inventory.productId, soldProduct.id),
            eq(inventory.storeId, input.storeId),
          ),
        )

      if (!productInventory) {
        tx.rollback()
        throw new Error('Product not found')
      }

      if (productInventory.stock === 0) {
        // No inventory control
        continue
      }

      if (productInventory.quantity < soldProduct.quantity) {
        tx.rollback()
        throw new Error('Insufficient product quantity')
      }

      await tx
        .update(inventory)
        .set({
          quantity: productInventory.quantity - soldProduct.quantity,
        })
        .where(
          and(
            eq(inventory.productId, soldProduct.id),
            eq(inventory.storeId, input.storeId),
          ),
        )
    }

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
