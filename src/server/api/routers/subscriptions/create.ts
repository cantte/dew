import { addDays } from 'date-fns'
import type { TypeOf } from 'zod'
import uuid from '~/lib/uuid'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import type { createSubscriptionInput } from '~/server/api/schemas/subscriptions'
import { subscriptions } from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
  input: TypeOf<typeof createSubscriptionInput>
}

export const createSubscription = async ({ ctx, input }: Options) => {
  await ctx.db.transaction(async (tx) => {
    const periodEnd = addDays(new Date(), 30)

    tx.insert(subscriptions).values({
      ...input,
      id: uuid(),
      status: 'active',
      periodEnd,
      userId: ctx.session.user.id,
    })
  })
}
