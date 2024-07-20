import { and, eq, sql } from 'drizzle-orm'
import type { TypeOf } from 'zod'
import uuid from '~/lib/uuid'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import { makeCashMovement } from '~/server/api/routers/cashRegisters/make-cash-movement'
import upsertProductsSummaries from '~/server/api/routers/products/upsertSummaries'
import upsertSaleSummary from '~/server/api/routers/sales/upsertSummary'
import type { findSaleInput } from '~/server/api/schemas/sales'
import { inventory, saleItems, sales } from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
  input: TypeOf<typeof findSaleInput>
}

export const cancelSale = async ({ ctx, input }: Options) => {
  return await ctx.db.transaction(async (tx) => {
    await tx
      .update(sales)
      .set({
        status: 'cancelled',
      })
      .where(eq(sales.code, input.code))

    const [sale] = await tx
      .select({
        code: sales.code,
        amount: sales.amount,
        status: sales.status,
        store: sales.storeId,
        createdAt: sales.createdAt,
      })
      .from(sales)
      .where(eq(sales.code, input.code))

    if (!sale) {
      tx.rollback()
      throw new Error('Sale not found')
    }

    const items = await tx
      .select({
        productId: saleItems.productId,
        quantity: saleItems.quantity,
        salePrice: saleItems.salePrice,
        profit: saleItems.profit,
      })
      .from(saleItems)
      .where(eq(saleItems.saleCode, sale.code))

    for (const item of items) {
      await tx
        .update(inventory)
        .set({
          quantity: sql`${inventory.quantity} + ${item.quantity}`,
        })
        .where(
          and(
            eq(inventory.productId, item.productId),
            eq(inventory.storeId, sale.store),
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

    const saleSummary = {
      date: sale.createdAt,
      amount: -sale.amount,
      profit: -items.reduce(
        (acc, item) => acc + item.profit * item.quantity,
        0,
      ),
      products: -items.reduce((acc, item) => acc + item.quantity, 0),
      storeId: sale.store,
      customers: -1,
      sales: -1,
    }

    await upsertSaleSummary({ tx, input: saleSummary })

    await makeCashMovement({
      tx,
      input: {
        storeId: sale.store,
        userId: ctx.session.user.id,
        type: 'OUT',
        amount: sale.amount,
      },
    })
  })
}
