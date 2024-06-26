import { desc, eq, sql } from 'drizzle-orm'
import type { TypeOf } from 'zod'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import type { byStoreInput } from '~/server/api/schemas/common'
import { customers, orders } from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
  input: TypeOf<typeof byStoreInput>
}

const listOrders = async ({ ctx, input }: Options) => {
  return await ctx.db
    .select({
      id: orders.id,
      customer: sql<string>`CONCAT(${customers.name}, ' (', ${customers.id}, ')')`,
      status: orders.status,
      amount: orders.amount,
      paymentMethod: orders.paymentMethod,
      address: orders.address,
      phone: orders.phone,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .innerJoin(customers, eq(customers.id, orders.customerId))
    .where(eq(orders.storeId, input.storeId))
    .orderBy(desc(orders.createdAt))
}

export default listOrders
