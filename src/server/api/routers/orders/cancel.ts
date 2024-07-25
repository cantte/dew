import { and, eq, sql } from 'drizzle-orm'
import type { TypeOf } from 'zod'
import uuid from '~/lib/uuid'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import { makeCashMovement } from '~/server/api/routers/cashRegisters/make-cash-movement'
import upsertOrderSummary from '~/server/api/routers/orders/upsertSummary'
import upsertProductsSummaries from '~/server/api/routers/products/upsertSummaries'
import type { byOrderIdInput } from '~/server/api/schemas/orders'
import { inventory, orderHistory, orderItems, orders } from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
  input: TypeOf<typeof byOrderIdInput>
}

const cancelOrder = async ({ ctx, input }: Options) => {
  await ctx.db.transaction(async (tx) => {
    await tx
      .update(orders)
      .set({ status: 'cancelled' })
      .where(eq(orders.id, input.id))

    await tx.insert(orderHistory).values({
      id: uuid(),
      orderId: input.id,
      status: 'cancelled',
      createdBy: ctx.session.user.id,
    })

    const [order] = await tx
      .select({
        id: orders.id,
        amount: orders.amount,
        status: orders.status,
        paymentMethod: orders.paymentMethod,
        store: orders.storeId,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .where(eq(orders.id, input.id))

    if (!order) {
      tx.rollback()
      throw new Error('Order not found')
    }

    const items = await tx
      .select({
        productId: orderItems.productId,
        quantity: orderItems.quantity,
        salePrice: orderItems.salePrice,
        profit: orderItems.profit,
      })
      .from(orderItems)
      .where(eq(orderItems.orderId, order.id))

    for (const item of items) {
      await tx
        .update(inventory)
        .set({
          quantity: sql`${inventory.quantity} + ${item.quantity}`,
        })
        .where(
          and(
            eq(inventory.productId, item.productId),
            eq(inventory.storeId, order.store),
          ),
        )
    }

    const soldProductSummaries = items.map((item) => ({
      id: uuid(),
      productId: item.productId,
      sales: -item.quantity,
      amount: -(item.salePrice * item.quantity),
      profit: -(item.profit * item.quantity),
    }))

    await upsertProductsSummaries({ tx, input: soldProductSummaries })

    const orderSummary = {
      date: order.createdAt,
      amount: -order.amount,
      profit: -items.reduce(
        (acc, item) => acc + item.profit * item.quantity,
        0,
      ),
      products: -items.reduce((acc, item) => acc + item.quantity, 0),
      storeId: order.store,
      customers: -1,
      sales: -1,
    }

    await upsertOrderSummary({ tx, input: orderSummary })

    if (order.paymentMethod === 'cash') {
      await makeCashMovement({
        tx,
        input: {
          storeId: order.store,
          userId: ctx.session.user.id,
          type: 'out',
          amount: order.amount,
        },
      })
    }
  })
}

export default cancelOrder
