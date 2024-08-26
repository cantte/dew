import { and, eq, sql } from 'drizzle-orm'
import type { TypeOf } from 'zod'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import findCurrentStore from '~/server/api/routers/stores/findCurrent'
import type { searchSelectableMonthsInput } from '~/server/api/schemas/sales'
import { saleSummary } from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
  input: TypeOf<typeof searchSelectableMonthsInput>
}

export const searchSelectableMonths = async ({ ctx, input }: Options) => {
  const store = await findCurrentStore({ ctx })

  if (!store) {
    return [{ month: new Date().getMonth() + 1 }]
  }

  const selectableMonths = await ctx.db
    .selectDistinct({
      month: sql<number>`EXTRACT(MONTH FROM ${saleSummary.createdAt})`.mapWith(
        Number,
      ),
    })
    .from(saleSummary)
    .where(
      and(
        eq(saleSummary.storeId, store.id),
        eq(sql`EXTRACT(YEAR FROM ${saleSummary.createdAt})`, input.year),
      ),
    )
    .orderBy(sql`EXTRACT(MONTH FROM ${saleSummary.createdAt})`)

  if (selectableMonths.length === 0) {
    return [{ month: new Date().getMonth() + 1 }]
  }

  return selectableMonths
}
