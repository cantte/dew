import { count, desc, eq, sum } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { createSaleInput } from "~/server/api/schemas/sales";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { products, saleItems, sales } from "~/server/db/schema";

export const salesProcedure = createTRPCRouter({
  create: protectedProcedure
    .input(createSaleInput)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        const code = uuid();
        await tx.insert(sales).values({
          ...input,
          code: code,
          createdBy: ctx.session.user.id,
        });

        const saleCode = code;
        const items = input.items.map((item) => ({
          ...item,
          id: uuid(),
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
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.sales.findMany({
      with: {
        customer: {
          id: true,
          name: true,
        },
      },
      orderBy: [desc(sales.createdAt)],
      where: eq(sales.createdBy, ctx.session.user.id),
    });
  }),
  overview: protectedProcedure.query(async ({ ctx }) => {
    // Caculate and return revenue, customers, sales and products
    const [revenue] = await ctx.db
      .select({
        revenue: sum(sales.amount),
      })
      .from(sales)
      .where(eq(sales.createdBy, ctx.session.user.id));

    const [customers] = await ctx.db
      .select({
        customers: count(sales.customerId),
      })
      .from(sales)
      .where(eq(sales.createdBy, ctx.session.user.id))
      .groupBy(sales.customerId);

    const [salesCount] = await ctx.db
      .select({
        salesCount: count(sales.code),
      })
      .from(sales)
      .where(eq(sales.createdBy, ctx.session.user.id));

    const [productsCount] = await ctx.db
      .select({
        productsCount: sum(saleItems.quantity),
      })
      .from(saleItems)
      .where(eq(saleItems.createdBy, ctx.session.user.id));

    return {
      revenue: revenue?.revenue ?? 0,
      customers: customers?.customers ?? 0,
      sales: salesCount?.salesCount ?? 0,
      products: productsCount?.productsCount ?? 0,
    };
  }),
});
