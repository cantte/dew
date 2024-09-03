import { and, between, eq, sum } from 'drizzle-orm'
import type { TypeOf } from 'zod'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import type { getSalesOverviewInput } from '~/server/api/schemas/sales'
import { saleSummary } from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
  input: TypeOf<typeof getSalesOverviewInput>
}

const genenrateSalesOverview = async ({ ctx, input }: Options) => {
  const [summary] = await ctx.db
    .select({
      amount: sum(saleSummary.amount).mapWith(Number),
      sales: sum(saleSummary.sales).mapWith(Number),
      products: sum(saleSummary.products).mapWith(Number),
      profit: sum(saleSummary.profit).mapWith(Number),
    })
    .from(saleSummary)
    .where(
      and(
        eq(saleSummary.storeId, input.storeId),
        between(saleSummary.createdAt, input.from, input.to),
      ),
    )

  if (!summary) {
    return {
      amount: 0,
      sales: 0,
      products: 0,
      profit: 0,
    }
  }

  return {
    amount: summary.amount,
    sales: summary.sales,
    products: summary.products,
    profit: summary.profit,
  }
}

export default genenrateSalesOverview
