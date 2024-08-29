import authedProcedure from '~/server/api/procedures/authed'
import { createSubscription } from '~/server/api/routers/subscriptions/create'
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
})
