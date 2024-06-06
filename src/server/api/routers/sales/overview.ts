import { and, between, count, eq, sum } from "drizzle-orm";
import type { TypeOf } from "zod";
import type { TRPCAuthedContext } from "~/server/api/procedures/authed";
import type { getSalesOverviewInput } from "~/server/api/schemas/sales";
import { saleItems, sales } from "~/server/db/schema";

type Options = {
  ctx: TRPCAuthedContext;
  input: TypeOf<typeof getSalesOverviewInput>;
};

const getSalesOverview = async ({ ctx, input }: Options) => {
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
};

export default getSalesOverview;
