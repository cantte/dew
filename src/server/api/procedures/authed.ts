import captureErrors from '~/server/api/middlewares/captureErrors'
import rateLimit from '~/server/api/middlewares/ratelimit'
import { isAuthed } from '~/server/api/middlewares/session'
import { trpcContext, type TRPCContextInner } from '~/server/api/trpc'

const authedProcedure = trpcContext.procedure
  .use(captureErrors)
  .use(isAuthed)
  .use(rateLimit)

export type TRPCAuthedContext = TRPCContextInner & {
  session: NonNullable<TRPCContextInner['session']>
}

export default authedProcedure
