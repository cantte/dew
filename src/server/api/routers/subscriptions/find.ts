import { eq } from 'drizzle-orm'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import { findCurrentStore } from '~/server/api/routers/stores/find-current'
import { subscriptions } from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
}

export const findUserSubscription = async ({ ctx }: Options) => {
  const store = await findCurrentStore({ ctx })

  if (store === undefined) {
    return undefined
  }

  const userId = store.createdBy

  const [subscription] = await ctx.db
    .select({
      id: subscriptions.id,
      externalId: subscriptions.externalId,
      status: subscriptions.status,
      planId: subscriptions.planId,
      periodEnd: subscriptions.periodEnd,
    })
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))

  return subscription
}
