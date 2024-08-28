import authedProcedure from '~/server/api/procedures/authed'
import { findUserTrial } from '~/server/api/routers/subscriptions/find-trial'
import { router } from '~/server/api/trpc'

export const subscriptionsRouter = router({
  trial: authedProcedure.query(async ({ ctx }) => {
    return await findUserTrial({ ctx })
  }),
})
