import { and, desc, eq, isNull, lt } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { z } from "zod";

import {
  createProductInput,
  linkToStoresInput,
  updateProductInput,
  updateProductQuantityInput,
} from "~/server/api/schemas/products";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { products, storeProducts } from "~/server/db/schema";

export const productsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createProductInput)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        const { stores, ...product } = input;
        const productId = uuid();

        await tx.insert(products).values({
          ...product,
          id: productId,
          createdBy: ctx.session.user.id,
        });

        await tx.insert(storeProducts).values(
          stores.map((storeId) => ({
            storeId: storeId,
            productId: productId,
          })),
        );
      });
    }),
  list: protectedProcedure
    .input(z.object({ storeId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db
        .select({
          id: products.id,
          code: products.code,
          name: products.name,
          description: products.description,
          purchasePrice: products.purchasePrice,
          salePrice: products.salePrice,
          stock: products.stock,
          quantity: products.quantity,
          createdAt: products.createdAt,
        })
        .from(products)
        .innerJoin(storeProducts, eq(products.id, storeProducts.productId))
        .where(
          and(
            eq(storeProducts.storeId, input.storeId),
            isNull(products.deletedAt),
          ),
        )
        .orderBy(desc(products.createdAt));
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
  findById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.products.findFirst({
        where: eq(products.id, input.id),
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
  update: protectedProcedure
    .input(updateProductInput)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.update(products).set(input).where(eq(products.id, input.id));
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(products)
        .set({ deletedAt: new Date() })
        .where(eq(products.id, input.id));
    }),
  linkToStores: protectedProcedure
    .input(linkToStoresInput)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        await tx
          .delete(storeProducts)
          .where(eq(storeProducts.productId, input.id));

        await tx.insert(storeProducts).values(
          input.stores.map((storeId) => ({
            storeId: storeId,
            productId: input.id,
          })),
        );
      });
    }),
});
