import { desc, eq, sql } from 'drizzle-orm'
import type { TypeOf } from 'zod'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import type { byStoreInput } from '~/server/api/schemas/common'
import { customers, sales } from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
  input: TypeOf<typeof byStoreInput>
}

const listSales = async ({ ctx, input }: Options) => {
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
    .where(eq(sales.storeId, input.storeId))
    .orderBy(desc(sales.createdAt))
}

export default listSales
