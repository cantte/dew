import { eq, sql } from 'drizzle-orm'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import findCurrentStore from '~/server/api/routers/stores/findCurrent'
import { saleSummary } from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
}

export const searchSelectableYears = async ({ ctx }: Options) => {
  const store = await findCurrentStore({ ctx })

  if (!store) {
    return [{ year: new Date().getFullYear() }]
  }

  return await ctx.db
    .selectDistinct({
      year: sql<number>`EXTRACT(YEAR FROM ${saleSummary.createdAt})`.mapWith(
        Number,
      ),
    })
    .from(saleSummary)
    .where(eq(saleSummary.storeId, store.id))
    .orderBy(sql`EXTRACT(YEAR FROM ${saleSummary.createdAt})`)
}
