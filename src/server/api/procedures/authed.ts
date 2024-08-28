import captureErrors from '~/server/api/middlewares/captureErrors'
import { performanceMiddleware } from '~/server/api/middlewares/performance'
import rateLimit from '~/server/api/middlewares/ratelimit'
import { isAuthed } from '~/server/api/middlewares/session'
import { type TRPCContextInner, trpcContext } from '~/server/api/trpc'

const authedProcedure = trpcContext.procedure
  .use(captureErrors)
  .use(performanceMiddleware)
  .use(isAuthed)
  .use(rateLimit)

export type TRPCAuthedContext = TRPCContextInner & {
  session: NonNullable<TRPCContextInner['session']>
}

export default authedProcedure
