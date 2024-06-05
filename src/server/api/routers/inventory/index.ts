import authedProcedure from "~/server/api/procedures/authed";
import listInventory from "~/server/api/routers/inventory/list";
import lowStockInventory from "~/server/api/routers/inventory/lowStock";
import updateInventory from "~/server/api/routers/inventory/update";
import { byStoreInput } from "~/server/api/schemas/common";
import { updateInventoryInput } from "~/server/api/schemas/inventory";
import { router } from "~/server/api/trpc";

const inventoryRouter = router({
  list: authedProcedure.input(byStoreInput).query(async ({ ctx, input }) => {
    return await listInventory({ ctx, input });
  }),
  lowStock: authedProcedure
    .input(byStoreInput)
    .query(async ({ ctx, input }) => {
      return await lowStockInventory({ ctx, input });
    }),
  update: authedProcedure
    .input(updateInventoryInput)
    .mutation(async ({ ctx, input }) => {
      await updateInventory({ ctx, input });
    }),
});

export default inventoryRouter;