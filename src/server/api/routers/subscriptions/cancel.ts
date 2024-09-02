import { eq } from 'drizzle-orm'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import { findUserSubscription } from '~/server/api/routers/subscriptions/find'
import { subscriptions } from '~/server/db/schema/subscriptions'
import { ePaycoCancelSubscription } from '~/server/epayco/cancel-subscription'

type Options = {
  ctx: TRPCAuthedContext
}

export const cancelSubscription = async ({ ctx }: Options) => {
  const subscription = await findUserSubscription({ ctx })

  if (!subscription) {
    throw new Error('Subscription not found')
  }

  const cancelResponse = await ePaycoCancelSubscription({
    id: subscription.externalId,
    public_key: process.env.EPAYCO_API_KEY!,
  })

  if (!cancelResponse.success) {
    throw new Error('Failed to cancel subscription')
  }

  await ctx.db
    .update(subscriptions)
    .set({
      status: 'inactive',
    })
    .where(eq(subscriptions.id, subscription.id))
}
