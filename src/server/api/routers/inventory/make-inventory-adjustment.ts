import { and, eq, inArray } from 'drizzle-orm'
import type { TypeOf } from 'zod'
import uuid from '~/lib/uuid'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import type { makeInventoryAdjustmentInput } from '~/server/api/schemas/inventory'
import { inventory, inventoryAdjustments } from '~/server/db/schema'

type DbTransaction = Parameters<
  Parameters<TRPCAuthedContext['db']['transaction']>[0]
>[0]

type Options = {
  tx: DbTransaction
  input: TypeOf<typeof makeInventoryAdjustmentInput>
}

export const makeInventoryAdjustment = async ({ tx, input }: Options) => {
  const productIds = input.products.map((p) => p.productId)
  const storeId = input.storeId

  const existingInventory = await tx
    .select({
      productId: inventory.productId,
      quantity: inventory.quantity,
    })
    .from(inventory)
    .where(
      and(
        eq(inventory.storeId, storeId),
        inArray(inventory.productId, productIds),
      ),
    )

  if (existingInventory.length !== productIds.length) {
    tx.rollback()
    throw new Error('Some products not found')
  }

  const newInventory = input.products.map((p) => {
    const existing = existingInventory.find((e) => e.productId === p.productId)

    if (!existing) {
      tx.rollback()
      throw new Error('Product not found')
    }

    const newQuatity =
      p.type === 'in'
        ? existing.quantity + p.quantity
        : existing.quantity - p.quantity

    if (newQuatity < 0) {
      tx.rollback()
      throw new Error('Insufficient stock')
    }

    return {
      productId: p.productId,
      quantity: newQuatity,
    }
  })

  const newInventoryAdjustments = input.products.map((p) => ({
    id: uuid(),
    storeId: storeId,
    productId: p.productId,
    quantity: p.quantity,
    type: p.type,
    createdBy: input.userId,
  }))

  await tx.insert(inventoryAdjustments).values(newInventoryAdjustments)

  const updatePromises = newInventory.map((i) =>
    tx
      .update(inventory)
      .set({
        quantity: i.quantity,
      })
      .where(
        and(
          eq(inventory.storeId, storeId),
          eq(inventory.productId, i.productId),
        ),
      ),
  )

  await Promise.all(updatePromises)
}
