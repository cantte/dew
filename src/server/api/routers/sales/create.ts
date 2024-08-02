import type { TypeOf } from 'zod'
import uuid from '~/lib/uuid'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import { makeCashMovement } from '~/server/api/routers/cashRegisters/make-cash-movement'
import { makeInventoryAdjustment } from '~/server/api/routers/inventory/make-inventory-adjustment'
import { notifyLowStock } from '~/server/api/routers/inventory/notifyLowStock'
import upsertProductsSummaries from '~/server/api/routers/products/upsertSummaries'
import { sendSaleCustomerNotificationEmail } from '~/server/api/routers/sales/send-customer-notification-email'
import upsertSaleSummary from '~/server/api/routers/sales/upsertSummary'
import { InventoryAdjustmentType } from '~/server/api/schemas/inventory'
import type { createSaleInput } from '~/server/api/schemas/sales'
import { saleItems, sales } from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
  input: TypeOf<typeof createSaleInput>
}

const createSale = async ({ ctx, input }: Options) => {
  const saleCode = uuid()

  await ctx.db.transaction(async (tx) => {
    await tx.insert(sales).values({
      ...input,
      code: saleCode,
      createdBy: ctx.session.user.id,
    })

    const items = input.items.map((item) => ({
      ...item,
      id: uuid(),
      saleCode,
      createdBy: ctx.session.user.id,
    }))

    await tx.insert(saleItems).values(items)

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

    const soldProductSummaries = items.map((item) => ({
      id: uuid(),
      productId: item.productId,
      sales: item.quantity,
      amount: item.salePrice * item.quantity,
      profit: item.profit * item.quantity,
    }))

    await upsertProductsSummaries({ tx, input: soldProductSummaries })

    const saleSummary = {
      date: new Date(),
      amount: input.amount,
      profit: input.items.reduce(
        (acc, item) => item.profit * item.quantity + acc,
        0,
      ),
      products: input.items.reduce((acc, item) => item.quantity + acc, 0),
      storeId: input.storeId,
      customers: 1,
      sales: 1,
    }

    await upsertSaleSummary({ tx, input: saleSummary })

    if (input.paymentMethod === 'cash') {
      await makeCashMovement({
        tx,
        input: {
          storeId: input.storeId,
          userId: ctx.session.user.id,
          type: 'in',
          amount: input.payment,
        },
      })

      const change = input.payment - input.amount
      if (change > 0) {
        await makeCashMovement({
          tx,
          input: {
            storeId: input.storeId,
            userId: ctx.session.user.id,
            type: 'out',
            amount: change,
          },
        })
      }
    }
  })

  await sendSaleCustomerNotificationEmail({ ctx, input: { code: saleCode } })
  await notifyLowStock({ ctx, input: { storeId: input.storeId } })
}

export default createSale
