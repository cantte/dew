import { endOfMonth, startOfMonth } from 'date-fns'
import { and, between, eq, sql, sum } from 'drizzle-orm'
import type { TypeOf } from 'zod'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import { findCurrentStore } from '~/server/api/routers/stores/find-current'
import type { monthlyReportInput } from '~/server/api/schemas/sales'
import { saleSummary } from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
  input: TypeOf<typeof monthlyReportInput>
}

export const generateMonthlySalesReport = async ({ ctx, input }: Options) => {
  const reportDate = new Date(input.year, input.month - 1, 1)
  const from = startOfMonth(reportDate)
  const to = endOfMonth(reportDate)

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
    date: new Date(reportDate.getFullYear(), 11, row.day),
  }))

  return report
}
