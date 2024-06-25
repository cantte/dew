import { and, count, eq, isNull, sql } from 'drizzle-orm'
import type { TypeOf } from 'zod'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import type { byStoreInput } from '~/server/api/schemas/common'
import { inventory, products } from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
  input: TypeOf<typeof byStoreInput>
}

const productsOverview = async ({ ctx, input }: Options) => {
  const result = await ctx.db
    .select({
      products: count(products.id),
      value: sql<number>`SUM(${products.salePrice} * ${inventory.quantity})`,
      cost: sql<number>`SUM(${products.purchasePrice} * ${inventory.quantity})`,
    })
    .from(products)
    .innerJoin(inventory, eq(products.id, inventory.productId))
    .where(
      and(eq(inventory.storeId, input.storeId), isNull(products.deletedAt)),
    )

  if (result.length === 0) {
    return {
      products: 0,
      value: 0,
      cost: 0,
    }
  }

  const response = result[0]

  if (response === undefined) {
    return {
      products: 0,
      value: 0,
      cost: 0,
    }
  }

  return response
}

export default productsOverview
