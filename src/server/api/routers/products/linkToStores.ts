import { and, eq, inArray } from 'drizzle-orm'
import type { TypeOf } from 'zod'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import type { linkToStoresInput } from '~/server/api/schemas/products'
import { inventory } from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
  input: TypeOf<typeof linkToStoresInput>
}

const linkProductToStores = async ({ ctx, input }: Options) => {
  await ctx.db.transaction(async (tx) => {
    const productInventory = await tx.query.inventory.findMany({
      where: eq(inventory.productId, input.id),
    })

    const storeIds = productInventory.map((inv) => inv.storeId)
    const newStores = input.stores.filter(
      (storeId) => !storeIds.includes(storeId),
    )

    await tx.insert(inventory).values(
      newStores.map((storeId) => ({
        storeId: storeId,
        productId: input.id,
        stock: 0,
        quantity: 0,
      })),
    )

    const deletedStores = storeIds.filter(
      (storeId) => !input.stores.includes(storeId),
    )

    if (deletedStores.length === 0) {
      return
    }

    await tx
      .delete(inventory)
      .where(
        and(
          eq(inventory.productId, input.id),
          inArray(inventory.storeId, deletedStores),
        ),
      )
  })
}

export default linkProductToStores
