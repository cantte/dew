import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import { products } from "~/server/db/schema";

export const createProductInput = z.object({
  id: z.string().min(1).max(255),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  purchasePrice: z.coerce.number().min(0),
  salePrice: z.coerce.number().min(0),
  stock: z.coerce.number().min(0),
});

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
