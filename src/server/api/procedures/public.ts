import captureErrors from '~/server/api/middlewares/captureErrors'
import rateLimit from '~/server/api/middlewares/ratelimit'
import { trpcContext } from '~/server/api/trpc'

const publicProcedure = trpcContext.procedure.use(captureErrors).use(rateLimit)

export default publicProcedure
