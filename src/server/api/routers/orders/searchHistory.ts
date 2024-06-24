import { desc, eq } from 'drizzle-orm'
import type { TypeOf } from 'zod'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import type { byOrderIdInput } from '~/server/api/schemas/orders'
import { orderHistory } from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
  input: TypeOf<typeof byOrderIdInput>
}

const searchOrderHistory = async ({ ctx, input }: Options) => {
  return await ctx.db.query.orderHistory.findMany({
    where: eq(orderHistory.orderId, input.id),
    orderBy: [desc(orderHistory.createdAt)],
  })
}

export default searchOrderHistory
