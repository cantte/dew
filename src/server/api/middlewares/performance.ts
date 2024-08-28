import { middleware } from '~/server/api/trpc'

export const performanceMiddleware = middleware(
  async ({ path, type, next }) => {
    performance.mark('Start')
    const result = await next()
    performance.mark('End')
    performance.measure(
      `[${result.ok ? 'OK' : 'ERROR'}][$1] ${type} '${path}'`,
      'Start',
      'End',
    )

    return result
  },
)
