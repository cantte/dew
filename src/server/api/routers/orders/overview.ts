import { and, between, eq, sum } from 'drizzle-orm'
import type { TypeOf } from 'zod'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import type { getOrderOverviewInput } from '~/server/api/schemas/orders'
import { orderSummary } from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
  input: TypeOf<typeof getOrderOverviewInput>
}

const getOrderOverview = async ({ ctx, input }: Options) => {
  const result = await ctx.db
    .select({
      amount: sum(orderSummary.amount).mapWith(Number),
      customers: sum(orderSummary.customers).mapWith(Number),
      orders: sum(orderSummary.orders).mapWith(Number),
      products: sum(orderSummary.products).mapWith(Number),
    })
    .from(orderSummary)
    .where(
      and(
        eq(orderSummary.storeId, input.storeId),
        between(orderSummary.createdAt, input.from, input.to),
      ),
    )

  if (!result) {
    return {
      revenue: 0,
      customers: 0,
      orders: 0,
      products: 0,
    }
  }

  const summary = result[0]

  if (!summary) {
    return {
      revenue: 0,
      customers: 0,
      orders: 0,
      products: 0,
    }
  }

  return {
    revenue: summary.amount,
    customers: summary.customers,
    orders: summary.orders,
    products: summary.products,
  }
}

export default getOrderOverview
