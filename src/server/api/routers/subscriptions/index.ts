import authedProcedure from '~/server/api/procedures/authed'
import { cancelSubscription } from '~/server/api/routers/subscriptions/cancel'
import { createSubscription } from '~/server/api/routers/subscriptions/create'
import { findUserSubscription } from '~/server/api/routers/subscriptions/find'
import { findUserTrial } from '~/server/api/routers/subscriptions/find-trial'
import { createSubscriptionInput } from '~/server/api/schemas/subscriptions'
import { router } from '~/server/api/trpc'

export const subscriptionsRouter = router({
  trial: authedProcedure.query(async ({ ctx }) => {
    return await findUserTrial({ ctx })
  }),
  create: authedProcedure
    .input(createSubscriptionInput)
    .mutation(async ({ ctx, input }) => {
      await createSubscription({ ctx, input })
    }),
  find: authedProcedure.query(async ({ ctx }) => {
    return await findUserSubscription({ ctx })
  }),
  cancel: authedProcedure.mutation(async ({ ctx }) => {
    await cancelSubscription({ ctx })
  }),
})
