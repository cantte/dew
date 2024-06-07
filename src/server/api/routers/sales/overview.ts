import { and, between, eq, sum } from "drizzle-orm";
import type { TypeOf } from "zod";
import type { TRPCAuthedContext } from "~/server/api/procedures/authed";
import type { getSalesOverviewInput } from "~/server/api/schemas/sales";
import { saleSummary } from "~/server/db/schema";

type Options = {
  ctx: TRPCAuthedContext;
  input: TypeOf<typeof getSalesOverviewInput>;
};

const getSalesOverview = async ({ ctx, input }: Options) => {
  const result = await ctx.db
    .select({
      amount: sum(saleSummary.amount),
      customers: sum(saleSummary.customers),
      sales: sum(saleSummary.sales),
      products: sum(saleSummary.products),
    })
    .from(saleSummary)
    .where(
      and(
        eq(saleSummary.storeId, input.storeId),
        between(saleSummary.createdAt, input.from, input.to),
      ),
    );

  if (!result) {
    return {
      revenue: 0,
      customers: 0,
      sales: 0,
      products: 0,
    };
  }

  const summary = result[0];

  if (!summary) {
    return {
      revenue: 0,
      customers: 0,
      sales: 0,
      products: 0,
    };
  }

  return {
    revenue: summary.amount ?? 0,
    customers: summary.customers ?? 0,
    sales: summary.sales ?? 0,
    products: summary.products ?? 0,
  };
};

export default getSalesOverview;
