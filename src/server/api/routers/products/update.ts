import { eq } from 'drizzle-orm'
import type { TypeOf } from 'zod'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import type { updateProductInput } from '~/server/api/schemas/products'
import { products } from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
  input: TypeOf<typeof updateProductInput>
}

const updateProduct = async ({ ctx, input }: Options) => {
  await ctx.db.update(products).set(input).where(eq(products.id, input.id))
}

export default updateProduct
