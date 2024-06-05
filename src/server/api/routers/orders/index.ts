import authedProcedure from "~/server/api/procedures/authed";
import createOrder from "~/server/api/routers/orders/create";
import listOrders from "~/server/api/routers/orders/list";
import { byStoreInput } from "~/server/api/schemas/common";
import { createOrderInput } from "~/server/api/schemas/orders";
import { router } from "~/server/api/trpc";

const ordersRouter = router({
  create: authedProcedure
    .input(createOrderInput)
    .mutation(async ({ ctx, input }) => {
      await createOrder({ ctx, input });
    }),
  list: authedProcedure.input(byStoreInput).query(async ({ ctx, input }) => {
    return await listOrders({ ctx, input });
  }),
});

export default ordersRouter;
