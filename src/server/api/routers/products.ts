import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import { products } from "~/server/db/schema";
import { createProductInput } from "~/server/api/schemas/products";
import { desc, eq } from "drizzle-orm";

export const productsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createProductInput)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(products).values({
        ...input,
        createdBy: ctx.session.user.id,
      });
    }),
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.products.findMany({
      orderBy: [desc(products.createdAt)],
      where: eq(products.createdBy, ctx.session.user.id),
    });
  }),
});
