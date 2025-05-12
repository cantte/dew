import { middleware } from '~/server/api/trpc'

const rateLimit = middleware(async ({ ctx, next }) => {
  return next()
})

export default rateLimit
