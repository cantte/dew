import { desc, eq, sql } from 'drizzle-orm'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import findCurrentStore from '~/server/api/routers/stores/findCurrent'
import { customers, sales } from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
}

export const searchLastSales = async ({ ctx }: Options) => {
  const store = await findCurrentStore({ ctx })

  if (!store) {
    return []
  }

  return await ctx.db
    .select({
      code: sales.code,
      customer: sql<string>`CONCAT(${customers.name}, ' (', ${customers.id}, ')')`,
      status: sales.status,
      amount: sales.amount,
      paymentMethod: sales.paymentMethod,
      createdAt: sales.createdAt,
    })
    .from(sales)
    .innerJoin(customers, eq(customers.id, sales.customerId))
    .where(eq(sales.storeId, store.id))
    .orderBy(desc(sales.createdAt))
    .limit(5)
}
