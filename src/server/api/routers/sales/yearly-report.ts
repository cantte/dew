import { startOfYear } from 'date-fns'
import { and, between, eq, sql, sum } from 'drizzle-orm'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import findCurrentStore from '~/server/api/routers/stores/findCurrent'
import { saleSummary } from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
}

export const generateYearlySalesReport = async ({ ctx }: Options) => {
  const today = new Date()
  const from = startOfYear(today)
  const to = today

  const store = await findCurrentStore({ ctx })

  if (!store) {
    return null
  }

  // Group by month the total amount per day of the report
  const data = await ctx.db
    .select({
      amount: sum(saleSummary.amount).mapWith(Number),
      customers: sum(saleSummary.customers).mapWith(Number),
      sales: sum(saleSummary.sales).mapWith(Number),
      products: sum(saleSummary.products).mapWith(Number),
      profit: sum(saleSummary.profit).mapWith(Number),
      month: sql<number>`EXTRACT(MONTH FROM ${saleSummary.createdAt})`,
    })
    .from(saleSummary)
    .where(
      and(
        eq(saleSummary.storeId, store.id),
        between(saleSummary.createdAt, from, to),
      ),
    )
    .groupBy(sql`EXTRACT(MONTH FROM ${saleSummary.createdAt})`)

  const report = data.map((row) => ({
    ...row,
    date: new Date(today.getFullYear(), row.month - 1, 1),
  }))

  return report
}