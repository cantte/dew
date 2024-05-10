import { and, desc, eq, isNull, lte, sql } from "drizzle-orm";
import { byStoreInput } from "~/server/api/schemas/common";
import { updateInventoryInput } from "~/server/api/schemas/inventory";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { inventory, products } from "~/server/db/schema";

export const inventoryRouter = createTRPCRouter({
  list: protectedProcedure.input(byStoreInput).query(async ({ ctx, input }) => {
    return ctx.db
      .select({
        id: products.id,
        code: products.code,
        name: products.name,
        stock: inventory.stock,
        quantity: inventory.quantity,
        isLowStock: sql<boolean>`inventory.quantity <= inventory.stock`,
      })
      .from(products)
      .innerJoin(inventory, eq(products.id, inventory.productId))
      .where(
        and(eq(inventory.storeId, input.storeId), isNull(products.deletedAt)),
      )
      .orderBy(desc(products.createdAt));
  }),
  lowStock: protectedProcedure
    .input(byStoreInput)
    .query(async ({ ctx, input }) => {
      return ctx.db
        .select({
          id: products.id,
          code: products.code,
          name: products.name,
          stock: inventory.stock,
          quantity: inventory.quantity,
        })
        .from(products)
        .innerJoin(inventory, eq(products.id, inventory.productId))
        .where(
          and(
            eq(inventory.storeId, input.storeId),
            isNull(products.deletedAt),
            lte(inventory.quantity, inventory.stock),
          ),
        )
        .orderBy(desc(products.createdAt));
    }),
  update: protectedProcedure
    .input(updateInventoryInput)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        const { id, quantity, operation } = input;

        const [productInventory] = await tx
          .select({
            quantity: inventory.quantity,
          })
          .from(inventory)
          .where(eq(inventory.productId, id));

        if (!productInventory) {
          throw new Error("Product not found");
        }

        if (input.operation === "remove") {
          if (productInventory.quantity < input.quantity) {
            throw new Error("Not enough stock");
          }
        }

        await tx
          .update(inventory)
          .set({
            stock: input.stock,
            quantity:
              operation === "add"
                ? productInventory.quantity + quantity
                : productInventory.quantity - quantity,
          })
          .where(eq(inventory.productId, id));
      });
    }),
});
