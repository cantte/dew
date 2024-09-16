import { and, desc, eq, inArray, isNull, sql } from 'drizzle-orm'
import type { TypeOf } from 'zod'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import type { byStoreInput } from '~/server/api/schemas/common'
import { inventory, products, productSummaries } from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
  input: TypeOf<typeof byStoreInput>
}

const getProductSuggestions = async ({ ctx, input }: Options) => {
  const mostSoldProductCodes = await ctx.db
    .select({
      id: productSummaries.productId,
    })
    .from(productSummaries)
    .orderBy(desc(productSummaries.sales))
    .limit(10)

  if (mostSoldProductCodes.length === 0) {
    return []
  }

  return ctx.db
    .select({
      id: products.id,
      code: products.code,
      name: products.name,
      description: products.description,
      purchasePrice: products.purchasePrice,
      salePrice: products.salePrice,
      quantity: inventory.quantity,
      isLowStock: sql<boolean>`inventory.quantity <= inventory.stock`,
    })
    .from(products)
    .innerJoin(inventory, eq(products.id, inventory.productId))
    .where(
      and(
        eq(inventory.storeId, input.storeId),
        isNull(products.deletedAt),
        eq(products.enabled, true),
        inArray(
          products.id,
          mostSoldProductCodes.map((p) => p.id),
        ),
      ),
    )
    .limit(5)
}

export default getProductSuggestions
