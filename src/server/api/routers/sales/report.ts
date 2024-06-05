import { subMonths } from "date-fns";
import { and, between, eq, sql, sum } from "drizzle-orm";
import type { TypeOf } from "zod";
import type { TRPCAuthedContext } from "~/server/api/procedures/authed";
import type { getSalesOverviewInput } from "~/server/api/schemas/sales";
import { saleItems, sales } from "~/server/db/schema";

type Options = {
  ctx: TRPCAuthedContext;
  input: TypeOf<typeof getSalesOverviewInput>;
};

const generateSalesReport = async ({ ctx, input }: Options) => {
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
    totalAmount === 0 ? 0 : (totalAmount - previousTotalAmount) / totalAmount;
  const profitImprovement =
    totalProfit === 0 ? 0 : (totalProfit - previousTotalProfit) / totalProfit;

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
};

export default generateSalesReport;
