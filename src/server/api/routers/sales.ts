import { subMonths } from "date-fns";
import { and, between, count, desc, eq, sql, sum } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { z } from "zod";
import NewSale from "~/emails/new-sale";
import { byStoreInput } from "~/server/api/schemas/common";
import { createSaleInput } from "~/server/api/schemas/sales";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  customers,
  inventory,
  products,
  saleItems,
  sales,
  stores,
} from "~/server/db/schema";
import resend from "~/server/email/resend";

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
              quantity: inventory.quantity,
            })
            .from(inventory)
            .where(
              and(
                eq(inventory.productId, soldProduct.id),
                eq(inventory.storeId, input.storeId),
              ),
            );

          if (product === undefined) {
            tx.rollback();
            throw new Error("Product not found");
          }

          if (product.quantity < soldProduct.quantity) {
            tx.rollback();
            throw new Error("Insufficient product quantity");
          }

          await tx
            .update(inventory)
            .set({
              quantity: product.quantity - soldProduct.quantity,
            })
            .where(
              and(
                eq(inventory.productId, soldProduct.id),
                eq(inventory.storeId, input.storeId),
              ),
            );

          // after updating the inventory, send an email to the customer
          const [customer] = await tx
            .select({
              email: customers.email,
              name: customers.name,
            })
            .from(customers)
            .where(eq(customers.id, input.customerId));

          if (customer === undefined) {
            return;
          }

          if (customer.email === null) {
            return;
          }

          const [store] = await tx
            .select({
              name: stores.name,
            })
            .from(stores)
            .where(eq(stores.id, input.storeId));

          if (store === undefined) {
            return;
          }

          await resend.emails.send({
            from: process.env.RESEND_EMAIL!,
            to: customer.email,
            subject: "Nueva venta registrada",
            react: NewSale({
              name: customer.name,
              total: input.amount,
              products: input.items.reduce(
                (acc, item) => item.quantity + acc,
                0,
              ),
              date: new Date(),
              url: process.env.VERCEL_URL
                ? `https://${process.env.VERCEL_URL}/sales/c/${code}`
                : `http://localhost:3000/sales/c/${code}`,
              store: store.name,
            }),
          });
        }
      });
    }),
  list: protectedProcedure.input(byStoreInput).query(async ({ ctx, input }) => {
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
      where: eq(sales.storeId, input.storeId),
    });
  }),
  overview: protectedProcedure
    .input(
      z.object({
        from: z.coerce.date(),
        to: z.coerce.date(),
        storeId: z.string().min(1).max(36),
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
            eq(sales.storeId, input.storeId),
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
            eq(sales.storeId, input.storeId),
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
            eq(sales.storeId, input.storeId),
            between(sales.createdAt, input.from, input.to),
          ),
        );

      const [productsCount] = await ctx.db
        .select({
          productsCount: sum(saleItems.quantity),
        })
        .from(saleItems)
        .innerJoin(sales, eq(sales.code, saleItems.saleCode))
        .where(
          and(
            eq(sales.storeId, input.storeId),
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
  findPublic: publicProcedure
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
  report: protectedProcedure
    .input(
      z.object({
        from: z.coerce.date(),
        to: z.coerce.date(),
        storeId: z.string().min(1).max(36),
      }),
    )
    .query(async ({ ctx, input }) => {
      const [totalAmountResult] = await ctx.db
        .select({
          totalAmount: sum(sales.amount),
        })
        .from(sales)
        .where(
          and(
            eq(sales.storeId, input.storeId),
            between(sales.createdAt, input.from, input.to),
          ),
        );

      const [totalProfitResult] = await ctx.db
        .select({
          totalProfit: sum(saleItems.profit),
        })
        .from(saleItems)
        .innerJoin(sales, eq(sales.code, saleItems.saleCode))
        .where(
          and(
            eq(sales.storeId, input.storeId),
            between(sales.createdAt, input.from, input.to),
          ),
        );

      // Calculate improvement respect to the previous month
      const previousFrom = subMonths(input.from.getTime(), 1);
      const previousTo = subMonths(input.to.getTime(), 1);

      const [previousTotalAmountResult] = await ctx.db
        .select({
          totalAmount: sum(sales.amount),
        })
        .from(sales)
        .where(
          and(
            eq(sales.storeId, input.storeId),
            between(sales.createdAt, previousFrom, previousTo),
          ),
        );

      const [previousTotalProfitResult] = await ctx.db
        .select({
          totalProfit: sum(saleItems.profit),
        })
        .from(saleItems)
        .innerJoin(sales, eq(sales.code, saleItems.saleCode))
        .where(
          and(
            eq(sales.storeId, input.storeId),
            between(sales.createdAt, previousFrom, previousTo),
          ),
        );

      const totalAmount = Number(totalAmountResult?.totalAmount ?? 0);
      const totalProfit = Number(totalProfitResult?.totalProfit ?? 0);
      const previousTotalAmount = Number(
        previousTotalAmountResult?.totalAmount ?? 0,
      );
      const previousTotalProfit = Number(
        previousTotalProfitResult?.totalProfit ?? 0,
      );

      // Calculate the improvement in percentage
      const amountImprovement =
        totalAmount === 0
          ? 0
          : (totalAmount - previousTotalAmount) / totalAmount;
      const profitImprovement =
        totalProfit === 0
          ? 0
          : (totalProfit - previousTotalProfit) / totalProfit;

      // Get totalAmount and totalProfit per day
      const totalAmountPerDay = await ctx.db
        .select({
          date: sql`date(${sales.createdAt})`,
          totalAmount: sum(sales.amount),
        })
        .from(sales)
        .where(
          and(
            eq(sales.storeId, input.storeId),
            between(sales.createdAt, input.from, input.to),
          ),
        )
        .groupBy(sql`date(${sales.createdAt})`);

      const totalProfitPerDay = await ctx.db
        .select({
          date: sql`date(${saleItems.createdAt})`,
          totalProfit: sum(saleItems.profit),
        })
        .from(saleItems)
        .innerJoin(sales, eq(sales.code, saleItems.saleCode))
        .where(
          and(
            eq(sales.storeId, input.storeId),
            between(sales.createdAt, input.from, input.to),
          ),
        )
        .groupBy(sql`date(${saleItems.createdAt})`);

      return {
        totalAmount,
        totalProfit,
        amountImprovement,
        profitImprovement,
        totalAmountPerDay: totalAmountPerDay.map((day) => ({
          total: Number(day.totalAmount),
          date: day.date as string,
        })),
        totalProfitPerDay: totalProfitPerDay.map((day) => ({
          total: Number(day.totalProfit),
          date: day.date as string,
        })),
      };
    }),
});
