import { and, desc, eq, isNull, sql } from 'drizzle-orm'
import type { TypeOf } from 'zod'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import type { searchProductsInput } from '~/server/api/schemas/products'
import { inventory, products } from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
  input: TypeOf<typeof searchProductsInput>
}

const searchProducts = async ({ ctx, input }: Options) => {
  return ctx.db
    .select({
      id: products.id,
      code: products.code,
      name: products.name,
      description: products.description,
    })
    .from(products)
    .innerJoin(inventory, eq(products.id, inventory.productId))
    .where(
      and(
        eq(inventory.storeId, input.storeId),
        isNull(products.deletedAt),
        sql`to_tsvector(${products.name}) @@ to_tsquery(${input.query})`,
      ),
    )
    .orderBy(desc(products.createdAt))
}

export default searchProducts
