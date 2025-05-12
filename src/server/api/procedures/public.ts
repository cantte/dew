import captureErrors from '~/server/api/middlewares/captureErrors'
import { performanceMiddleware } from '~/server/api/middlewares/performance'
import { trpcContext } from '~/server/api/trpc'

const publicProcedure = trpcContext.procedure
  .use(captureErrors)
  .use(performanceMiddleware)

export default publicProcedure
