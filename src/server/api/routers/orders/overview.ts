import { and, between, eq, sum } from "drizzle-orm";
import type { TypeOf } from "zod";
import type { TRPCAuthedContext } from "~/server/api/procedures/authed";
import type { getOrderOverviewInput } from "~/server/api/schemas/orders";
import { orderSummary } from "~/server/db/schema";

type Options = {
  ctx: TRPCAuthedContext;
  input: TypeOf<typeof getOrderOverviewInput>;
};

const getOrderOverview = async ({ ctx, input }: Options) => {
  const result = await ctx.db
    .select({
      amount: sum(orderSummary.amount),
      customers: sum(orderSummary.customers),
      orders: sum(orderSummary.orders),
      products: sum(orderSummary.products),
    })
    .from(orderSummary)
    .where(
      and(
        eq(orderSummary.storeId, input.storeId),
        between(orderSummary.createdAt, input.from, input.to),
      ),
    );

  if (!result) {
    return {
      revenue: 0,
      customers: 0,
      orders: 0,
      products: 0,
    };
  }

  const summary = result[0];

  if (!summary) {
    return {
      revenue: 0,
      customers: 0,
      orders: 0,
      products: 0,
    };
  }

  return {
    revenue: summary.amount ?? 0,
    customers: summary.customers ?? 0,
    orders: summary.orders ?? 0,
    products: summary.products ?? 0,
  };
};

export default getOrderOverview;
