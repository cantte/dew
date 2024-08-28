import captureErrors from '~/server/api/middlewares/captureErrors'
import { performanceMiddleware } from '~/server/api/middlewares/performance'
import rateLimit from '~/server/api/middlewares/ratelimit'
import { trpcContext } from '~/server/api/trpc'

const publicProcedure = trpcContext.procedure
  .use(captureErrors)
  .use(performanceMiddleware)
  .use(rateLimit)

export default publicProcedure
