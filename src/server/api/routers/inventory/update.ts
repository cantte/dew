import { eq } from 'drizzle-orm'
import type { TypeOf } from 'zod'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import type { updateInventoryInput } from '~/server/api/schemas/inventory'
import { inventory } from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
  input: TypeOf<typeof updateInventoryInput>
}

const updateInventory = async ({ ctx, input }: Options) => {
  await ctx.db.transaction(async (tx) => {
    const { id, quantity, operation } = input

    const [productInventory] = await tx
      .select({
        quantity: inventory.quantity,
      })
      .from(inventory)
      .where(eq(inventory.productId, id))

    if (!productInventory) {
      throw new Error('Product not found')
    }

    if (input.operation === 'remove') {
      if (productInventory.quantity < input.quantity) {
        throw new Error('Not enough stock')
      }
    }

    await tx
      .update(inventory)
      .set({
        stock: input.stock,
        quantity:
          operation === 'add'
            ? productInventory.quantity + quantity
            : productInventory.quantity - quantity,
        lowStockNotificationSended: false,
      })
      .where(eq(inventory.productId, id))
  })
}

export default updateInventory
