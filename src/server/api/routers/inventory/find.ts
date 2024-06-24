import { and, desc, eq, isNull, sql } from 'drizzle-orm'
import type { TypeOf } from 'zod'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import type { findInventoryInput } from '~/server/api/schemas/inventory'
import { inventory, products } from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
  input: TypeOf<typeof findInventoryInput>
}

const findProductInventory = async ({ ctx, input }: Options) => {
  const [value] = await ctx.db
    .select({
      stock: inventory.stock,
      quantity: inventory.quantity,
      isLowStock: sql<boolean>`inventory.quantity <= inventory.stock`,
    })
    .from(products)
    .innerJoin(inventory, eq(products.id, inventory.productId))
    .where(
      and(
        eq(inventory.storeId, input.storeId),
        eq(products.id, input.id),
        isNull(products.deletedAt),
      ),
    )
    .orderBy(desc(products.createdAt))

  return value
}

export default findProductInventory
