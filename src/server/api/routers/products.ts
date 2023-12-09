import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import { products } from "~/server/db/schema";
import { createProductInput } from "~/server/api/schemas/products";

export const productsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createProductInput)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(products).values({
        ...input,
        createdBy: ctx.session.user.id,
      });
    }),
});
