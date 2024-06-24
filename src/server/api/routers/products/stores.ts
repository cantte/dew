import { eq } from 'drizzle-orm'
import type { TypeOf } from 'zod'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import type { byProductIdInput } from '~/server/api/schemas/products'
import { inventory, stores } from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
  input: TypeOf<typeof byProductIdInput>
}

const listProductStores = async ({ ctx, input }: Options) => {
  return ctx.db
    .select({
      id: inventory.storeId,
      name: stores.name,
    })
    .from(inventory)
    .innerJoin(stores, eq(inventory.storeId, stores.id))
    .where(eq(inventory.productId, input.id))
}

export default listProductStores
