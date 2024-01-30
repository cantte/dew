import { and, desc, eq, lt } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { z } from "zod";

import {
  createProductInput,
  updateProductQuantityInput,
} from "~/server/api/schemas/products";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { products } from "~/server/db/schema";

export const productsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createProductInput)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(products).values({
        ...input,
        id: uuid(),
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
    .input(z.object({ code: z.string().min(1).max(255) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.products.findFirst({
        columns: {
          code: true,
        },
        where: and(
          eq(products.code, input.code),
          eq(products.createdBy, ctx.session.user.id),
        ),
      });
    }),
  find: protectedProcedure
    .input(z.object({ code: z.string().min(1).max(255) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.products.findFirst({
        where: and(
          eq(products.code, input.code),
          eq(products.createdBy, ctx.session.user.id),
        ),
      });
    }),
  lowStock: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.products.findMany({
      where: and(
        eq(products.createdBy, ctx.session.user.id),
        lt(products.quantity, products.stock),
      ),
      limit: 10,
    });
  }),
  updateQuantity: protectedProcedure
    .input(updateProductQuantityInput)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        const [product] = await tx
          .select({
            quantity: products.quantity,
          })
          .from(products)
          .where(eq(products.id, input.id));

        if (product === undefined) {
          throw new Error("Producto no encontrado");
        }

        if (input.operation === "remove") {
          if (product.quantity < input.quantity) {
            throw new Error("Cantidad insuficiente");
          }
        }

        await tx
          .update(products)
          .set({
            quantity:
              input.operation === "add"
                ? product.quantity + input.quantity
                : product.quantity - input.quantity,
          })
          .where(eq(products.id, input.id));
      });
    }),
});
