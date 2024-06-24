import { and, eq, inArray } from 'drizzle-orm'
import type { TypeOf } from 'zod'
import uuid from '~/lib/uuid'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import type { bulkCreateProductInput } from '~/server/api/schemas/products'
import { inventory, products as productsSchema } from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
  input: TypeOf<typeof bulkCreateProductInput>
}

const bulkCreateProduct = async ({ ctx, input }: Options) => {
  const productCodes = input.products.map((product) => product.code)
  const userId = ctx.session.user.id

  const existingCodes = await ctx.db.query.products.findMany({
    columns: {
      code: true,
    },
    where: and(
      inArray(productsSchema.code, productCodes),
      eq(productsSchema.createdBy, userId),
    ),
  })

  if (existingCodes.length > 0) {
    throw new Error(
      `Products with codes \"${existingCodes.map((product) => product.code).join(', ')}\" already exist`,
    )
  }

  await ctx.db.transaction(async (tx) => {
    const { store, products } = input

    const productsToInsert = products.map((product) => ({
      ...product,
      id: uuid(),
      createdBy: userId,
    }))

    await tx.insert(productsSchema).values(productsToInsert)

    const inventoryToInsert = productsToInsert.map((product) => ({
      storeId: store,
      productId: product.id,
      stock: 0,
      quantity: 0,
    }))

    await tx.insert(inventory).values(inventoryToInsert)
  })
}

export default bulkCreateProduct
