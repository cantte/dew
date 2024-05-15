import { and, count, desc, eq, isNull, sql } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { z } from "zod";
import { byStoreInput } from "~/server/api/schemas/common";

import {
  createProductInput,
  linkToStoresInput,
  updateProductInput,
} from "~/server/api/schemas/products";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { inventory, products } from "~/server/db/schema";

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

        await tx.insert(inventory).values(
          stores.map((storeId) => ({
            storeId: storeId,
            productId: productId,
            stock: 0,
            quantity: 0,
          })),
        );
      });
    }),
  list: protectedProcedure.input(byStoreInput).query(async ({ ctx, input }) => {
    return ctx.db
      .select({
        id: products.id,
        code: products.code,
        name: products.name,
        description: products.description,
        purchasePrice: products.purchasePrice,
        salePrice: products.salePrice,
        createdAt: products.createdAt,
      })
      .from(products)
      .innerJoin(inventory, eq(products.id, inventory.productId))
      .where(
        and(eq(inventory.storeId, input.storeId), isNull(products.deletedAt)),
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
  findForSale: protectedProcedure
    .input(z.object({ code: z.string().min(1).max(255) }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select({
          id: products.id,
          code: products.code,
          name: products.name,
          description: products.description,
          quantity: inventory.quantity,
          salePrice: products.salePrice,
          purchasePrice: products.purchasePrice,
        })
        .from(products)
        .innerJoin(inventory, eq(products.id, inventory.productId))
        .where(
          and(
            eq(products.code, input.code),
            isNull(products.deletedAt),
            eq(products.createdBy, ctx.session.user.id),
          ),
        );

      if (result.length === 0) {
        return null;
      }

      return result[0];
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
        await tx.delete(inventory).where(eq(inventory.productId, input.id));

        await tx.insert(inventory).values(
          input.stores.map((storeId) => ({
            storeId: storeId,
            productId: input.id,
            stock: 0,
            quantity: 0,
          })),
        );
      });
    }),
  stores: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db
        .select({
          id: inventory.storeId,
        })
        .from(inventory)
        .where(eq(inventory.productId, input.id));
    }),
  overview: protectedProcedure
    .input(byStoreInput)
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select({
          products: count(products.id),
          value: sql<number>`SUM(${products.salePrice} * ${inventory.quantity})`,
          cost: sql<number>`SUM(${products.purchasePrice} * ${inventory.quantity})`,
        })
        .from(products)
        .innerJoin(inventory, eq(products.id, inventory.productId))
        .where(
          and(eq(inventory.storeId, input.storeId), isNull(products.deletedAt)),
        );

      if (result.length === 0) {
        return {
          products: 0,
          value: 0,
          cost: 0,
        };
      }

      const response = result[0];

      if (response === undefined) {
        return {
          products: 0,
          value: 0,
          cost: 0,
        };
      }

      return response;
    }),
});
