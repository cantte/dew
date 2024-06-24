import { TRPCError } from '@trpc/server'
import { middleware } from '~/server/api/trpc'
import { ratelimit } from '~/server/ratelimit'

const rateLimit = middleware(async ({ ctx, next }) => {
  if (process.env.NODE_ENV === 'development') {
    return next()
  }

  const { success } = await ratelimit.limit(ctx.session?.user?.id ?? 'anon')

  if (!success) {
    throw new TRPCError({
      message: 'Rate limit exceeded',
      code: 'BAD_REQUEST',
    })
  }

  return next()
})

export default rateLimit
