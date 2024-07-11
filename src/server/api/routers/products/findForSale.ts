import { and, eq, isNull } from 'drizzle-orm'
import type { TypeOf } from 'zod'
import { applyDiscount } from '~/lib/utils'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import searchProductDiscounts from '~/server/api/routers/products/searchDiscount'
import findCurrentStore from '~/server/api/routers/stores/findCurrent'
import type { byCodeProductInput } from '~/server/api/schemas/products'
import { inventory, products } from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
  input: TypeOf<typeof byCodeProductInput>
}

const findProductForSale = async ({ ctx, input }: Options) => {
  const store = await findCurrentStore({ ctx })

  if (!store) {
    return null
  }

  const result = await ctx.db
    .select({
      id: products.id,
      code: products.code,
      name: products.name,
      description: products.description,
      quantity: inventory.quantity,
      salePrice: products.salePrice,
      purchasePrice: products.purchasePrice,
    })
    .from(products)
    .innerJoin(inventory, eq(products.id, inventory.productId))
    .where(
      and(
        eq(products.code, input.code),
        isNull(products.deletedAt),
        eq(inventory.storeId, store.id),
      ),
    )

  if (result.length === 0) {
    return null
  }

  const product = result[0]

  if (!product) {
    return null
  }

  const discounts = await searchProductDiscounts({
    ctx,
    input: {
      id: product.id,
    },
  })

  return {
    ...product,
    finalPrice: applyDiscount(product.salePrice, discounts),
    discounts: discounts,
  }
}

export default findProductForSale
