import { desc, eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { byStoreInput } from "~/server/api/schemas/common";
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
  list: protectedProcedure.input(byStoreInput).query(async ({ ctx, input }) => {
    return ctx.db.query.orders.findMany({
      with: {
        customer: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [desc(orders.createdAt)],
      where: eq(orders.storeId, input.storeId),
    });
  }),
});
