import { eq } from 'drizzle-orm'
import type { TypeOf } from 'zod'
import type { byOrderIdInput } from '~/server/api/schemas/orders'
import type { TRPCContextInner } from '~/server/api/trpc'
import { orders } from '~/server/db/schema/orders'

type Options = {
  ctx: TRPCContextInner
  input: TypeOf<typeof byOrderIdInput>
}

const findOrder = async ({ ctx, input }: Options) => {
  return await ctx.db.query.orders.findFirst({
    with: {
      customer: {
        columns: {
          id: true,
          name: true,
        },
      },
      orderItems: {
        with: {
          product: {
            columns: {
              code: true,
              name: true,
            },
          },
        },
      },
    },
    where: eq(orders.id, input.id),
  })
}

export default findOrder
