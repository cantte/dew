import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { products, saleItems, sales } from "~/server/db/schema";
import { createSaleInput } from "~/server/api/schemas/sales";
import { eq } from "drizzle-orm";

export const salesProcedure = createTRPCRouter({
  create: protectedProcedure
    .input(createSaleInput)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        await tx.insert(sales).values({
          ...input,
          createdBy: ctx.session.user.id,
        });

        const saleCode = input.code;
        const items = input.items.map((item) => ({
          ...item,
          id: "",
          saleCode,
          createdBy: ctx.session.user.id,
        }));

        await tx.insert(saleItems).values(items);

        const soldProducts = items.map((item) => ({
          id: item.productId,
          quantity: item.quantity,
        }));

        for (const soldProduct of soldProducts) {
          const [product] = await tx
            .select({
              quantity: products.quantity,
            })
            .from(products)
            .where(eq(products.id, soldProduct.id));

          if (product === undefined) {
            tx.rollback();
            throw new Error("Product not found");
          }

          if (product.quantity < soldProduct.quantity) {
            tx.rollback();
            throw new Error("Insufficient product quantity");
          }

          await tx
            .update(products)
            .set({
              quantity: product.quantity - soldProduct.quantity,
            })
            .where(eq(products.id, soldProduct.id));
        }
      });
    }),
});
