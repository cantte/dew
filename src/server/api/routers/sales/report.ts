import { subMonths } from "date-fns";
import { and, between, eq, sum } from "drizzle-orm";
import type { TypeOf } from "zod";
import type { TRPCAuthedContext } from "~/server/api/procedures/authed";
import type { getSalesOverviewInput } from "~/server/api/schemas/sales";
import { saleSummary } from "~/server/db/schema";

type Options = {
  ctx: TRPCAuthedContext;
  input: TypeOf<typeof getSalesOverviewInput>;
};

const generateSalesReport = async ({ ctx, input }: Options) => {
  const [summary] = await ctx.db
    .select({
      amount: sum(saleSummary.amount),
      customers: sum(saleSummary.customers),
      sales: sum(saleSummary.sales),
      products: sum(saleSummary.products),
      profit: sum(saleSummary.profit),
    })
    .from(saleSummary)
    .where(
      and(
        eq(saleSummary.storeId, input.storeId),
        between(saleSummary.createdAt, input.from, input.to),
      ),
    );

  // Calculate improvement respect to the previous month
  const previousFrom = subMonths(input.from.getTime(), 1);
  const previousTo = subMonths(input.to.getTime(), 1);

  const [previousSummary] = await ctx.db
    .select({
      amount: sum(saleSummary.amount),
      customers: sum(saleSummary.customers),
      sales: sum(saleSummary.sales),
      products: sum(saleSummary.products),
      profit: sum(saleSummary.profit),
    })
    .from(saleSummary)
    .where(
      and(
        eq(saleSummary.storeId, input.storeId),
        between(saleSummary.createdAt, previousFrom, previousTo),
      ),
    );

  const totalAmount = Number(summary?.amount ?? 0);
  const totalProfit = Number(summary?.profit ?? 0);
  const previousTotalAmount = Number(previousSummary?.amount ?? 0);
  const previousTotalProfit = Number(previousSummary?.profit ?? 0);

  // Calculate the improvement in percentage
  const amountImprovement =
    totalAmount === 0 ? 0 : (totalAmount - previousTotalAmount) / totalAmount;
  const profitImprovement =
    totalProfit === 0 ? 0 : (totalProfit - previousTotalProfit) / totalProfit;

  // Get totalAmount and totalProfit per day
  const totalAmountPerDay = await ctx.db
    .select({
      date: saleSummary.date,
      total: saleSummary.amount,
    })
    .from(saleSummary)
    .where(
      and(
        eq(saleSummary.storeId, input.storeId),
        between(saleSummary.createdAt, input.from, input.to),
      ),
    );

  const totalProfitPerDay = await ctx.db
    .select({
      date: saleSummary.date,
      total: saleSummary.profit,
    })
    .from(saleSummary)
    .where(
      and(
        eq(saleSummary.storeId, input.storeId),
        between(saleSummary.createdAt, input.from, input.to),
      ),
    );

  return {
    totalAmount,
    totalProfit,
    amountImprovement,
    profitImprovement,
    totalAmountPerDay,
    totalProfitPerDay,
  };
};

export default generateSalesReport;
