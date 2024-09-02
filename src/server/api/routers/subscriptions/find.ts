import { eq } from 'drizzle-orm'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import { subscriptions } from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
}

export const findUserSubscription = async ({ ctx }: Options) => {
  const userId = ctx.session.user.id

  const [subscription] = await ctx.db
    .select({
      id: subscriptions.id,
      status: subscriptions.status,
      planId: subscriptions.planId,
      periodEnd: subscriptions.periodEnd,
    })
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))

  return subscription
}
