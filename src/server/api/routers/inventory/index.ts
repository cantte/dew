import authedProcedure from '~/server/api/procedures/authed'
import findProductInventory from '~/server/api/routers/inventory/find'
import lowStockInventory from '~/server/api/routers/inventory/lowStock'
import { makeInventoryAdjustment } from '~/server/api/routers/inventory/make-inventory-adjustment'
import updateInventory from '~/server/api/routers/inventory/update'
import { byStoreInput } from '~/server/api/schemas/common'
import {
  findInventoryInput,
  makeInventoryAdjustmentInput,
  updateInventoryInput,
} from '~/server/api/schemas/inventory'
import { router } from '~/server/api/trpc'

const inventoryRouter = router({
  lowStock: authedProcedure
    .input(byStoreInput)
    .query(async ({ ctx, input }) => {
      return await lowStockInventory({ ctx, input })
    }),
  update: authedProcedure
    .input(updateInventoryInput)
    .mutation(async ({ ctx, input }) => {
      await updateInventory({ ctx, input })
    }),
  find: authedProcedure
    .input(findInventoryInput)
    .query(async ({ ctx, input }) => {
      return await findProductInventory({ ctx, input })
    }),
  makeAdjustment: authedProcedure
    .input(makeInventoryAdjustmentInput.omit({ userId: true }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        await makeInventoryAdjustment({
          tx,
          input: {
            ...input,
            userId: ctx.session.user.id,
          },
        })
      })
    }),
})

export default inventoryRouter
