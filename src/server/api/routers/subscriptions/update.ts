import { eq } from 'drizzle-orm'
import type { TypeOf } from 'zod'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import type { updateSubscriptionInput } from '~/server/api/schemas/subscriptions'
import { subscriptions } from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
  input: TypeOf<typeof updateSubscriptionInput>
}

export const updateSubscription = async ({ ctx, input }: Options) => {
  await ctx.db.transaction(async (tx) => {
    tx.update(subscriptions)
      .set({
        status: input.status,
      })
      .where(eq(subscriptions.id, input.id))
  })
}
