import { middleware, trpcContext } from '~/server/api/trpc'

export const performanceMiddleware = middleware(async ({ path, next }) => {
  const start = Date.now()

  if (trpcContext._config.isDev) {
    // artificial delay in dev
    const waitMs = Math.floor(Math.random() * 400) + 100
    await new Promise((resolve) => setTimeout(resolve, waitMs))
  }

  const result = await next()

  const end = Date.now()
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`)

  return result
})
