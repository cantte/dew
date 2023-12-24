import { desc, eq } from "drizzle-orm";
import { z } from "zod";

import { createProductInput } from "~/server/api/schemas/products";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { products } from "~/server/db/schema";

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
  exists: protectedProcedure
    .input(z.object({ id: z.string().min(1).max(255) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.products.findFirst({
        columns: {
          id: true,
        },
        where: eq(products.id, input.id),
      });
    }),
  find: protectedProcedure
    .input(z.object({ id: z.string().min(1).max(255) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.products.findFirst({
        where: eq(products.id, input.id),
      });
    }),
});
