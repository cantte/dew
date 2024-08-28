import authedProcedure from '~/server/api/procedures/authed'
import { checkUserTrialIsActive } from '~/server/api/routers/subscriptions/check-trial-active'
import { router } from '~/server/api/trpc'

export const subscriptionsRouter = router({
  checkTrialActive: authedProcedure.query(async ({ ctx }) => {
    return await checkUserTrialIsActive({ ctx })
  }),
})
