import { and, between, count, desc, eq, sum } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { z } from "zod";
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
          columns: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [desc(sales.createdAt)],
      where: eq(sales.createdBy, ctx.session.user.id),
    });
  }),
  overview: protectedProcedure
    .input(
      z.object({
        from: z.coerce.date(),
        to: z.coerce.date(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // Caculate and return revenue, customers, sales and products
      const [revenue] = await ctx.db
        .select({
          revenue: sum(sales.amount),
        })
        .from(sales)
        .where(
          and(
            eq(sales.createdBy, ctx.session.user.id),
            between(sales.createdAt, input.from, input.to),
          ),
        );

      const [customers] = await ctx.db
        .select({
          customers: count(sales.customerId),
        })
        .from(sales)
        .where(
          and(
            eq(sales.createdBy, ctx.session.user.id),
            between(sales.createdAt, input.from, input.to),
          ),
        )
        .groupBy(sales.customerId);

      const [salesCount] = await ctx.db
        .select({
          salesCount: count(sales.code),
        })
        .from(sales)
        .where(
          and(
            eq(sales.createdBy, ctx.session.user.id),
            between(sales.createdAt, input.from, input.to),
          ),
        );

      const [productsCount] = await ctx.db
        .select({
          productsCount: sum(saleItems.quantity),
        })
        .from(saleItems)
        .where(
          and(
            eq(saleItems.createdBy, ctx.session.user.id),
            between(saleItems.createdAt, input.from, input.to),
          ),
        );

      return {
        revenue: revenue?.revenue ?? 0,
        customers: customers?.customers ?? 0,
        sales: salesCount?.salesCount ?? 0,
        products: productsCount?.productsCount ?? 0,
      };
    }),
  find: protectedProcedure
    .input(z.object({ code: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.sales.findFirst({
        with: {
          customer: {
            columns: {
              id: true,
              name: true,
            },
          },
          saleItems: {
            with: {
              product: {
                columns: {
                  code: true,
                  name: true,
                },
              },
            },
          },
        },
        where: eq(sales.code, input.code),
      });
    }),
  mostSoldProducts: protectedProcedure.query(async ({ ctx }) => {
    // Return the 3 most sold products
    return ctx.db
      .select({
        id: products.id,
        name: products.name,
        quantity: sum(saleItems.quantity),
        amount: sum(saleItems.salePrice),
        profit: sum(saleItems.profit),
      })
      .from(products)
      .innerJoin(saleItems, eq(products.id, saleItems.productId))
      .groupBy(products.id)
      .orderBy(desc(sum(saleItems.quantity)))
      .limit(3);
  }),
});
