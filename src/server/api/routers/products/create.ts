import type { TypeOf } from 'zod'
import uuid from '~/lib/uuid'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import checkProductExistence from '~/server/api/routers/products/exists'
import type { createProductInput } from '~/server/api/schemas/products'
import { inventory, products } from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
  input: TypeOf<typeof createProductInput>
}

const createProduct = async ({ ctx, input }: Options) => {
  const exists = await checkProductExistence({
    ctx,
    input: { code: input.code },
  })

  if (exists) {
    throw new Error('Product already exists')
  }

  await ctx.db.transaction(async (tx) => {
    const { storeId, stock, quantity, ...product } = input
    const productId = uuid()

    await tx.insert(products).values({
      ...product,
      id: productId,
      createdBy: ctx.session.user.id,
    })

    await tx.insert(inventory).values({
      storeId: storeId,
      productId: productId,
      stock: stock,
      quantity: quantity,
    })
  })
}

export default createProduct
