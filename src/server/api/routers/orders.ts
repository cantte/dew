import { v4 as uuid } from "uuid";
import { createOrderInput } from "~/server/api/schemas/orders";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { orderItems, orders } from "~/server/db/schema";

export const ordersRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createOrderInput)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        const id = uuid();

        await tx.insert(orders).values({
          ...input,
          id: id,
          createdBy: ctx.session.user.id,
        });

        const items = input.items.map((item) => ({
          ...item,
          id: uuid(),
          orderId: id,
          createdBy: ctx.session.user.id,
        }));

        await tx.insert(orderItems).values(items);
      });
    }),
});
