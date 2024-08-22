import { startOfMonth } from 'date-fns'
import { and, between, eq, sql, sum } from 'drizzle-orm'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import findCurrentStore from '~/server/api/routers/stores/findCurrent'
import { saleSummary } from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
}

export const generateMonthlySalesReport = async ({ ctx }: Options) => {
  const today = new Date()
  const from = startOfMonth(today)
  const to = today

  const store = await findCurrentStore({ ctx })

  if (!store) {
    return null
  }

  // Group by month the total amount per day of the report
  const data = await ctx.db
    .select({
      amount: sum(saleSummary.amount).mapWith(Number),
      sales: sum(saleSummary.sales).mapWith(Number),
      products: sum(saleSummary.products).mapWith(Number),
      profit: sum(saleSummary.profit).mapWith(Number),
      day: sql<number>`EXTRACT(DAY FROM ${saleSummary.createdAt})`,
    })
    .from(saleSummary)
    .where(
      and(
        eq(saleSummary.storeId, store.id),
        between(saleSummary.createdAt, from, to),
      ),
    )
    .groupBy(sql`EXTRACT(DAY FROM ${saleSummary.createdAt})`)
    .orderBy(sql`EXTRACT(DAY FROM ${saleSummary.createdAt})`)

  const report = data.map((row) => ({
    ...row,
    date: new Date(today.getFullYear(), 11, row.day),
  }))

  return report
}
