import { captureException as SentryCaptureException } from '@sentry/nextjs'
import { middleware } from '~/server/api/trpc'

const captureErrors = middleware(async ({ next }) => {
  const result = await next()

  if (result && !result.ok) {
    const cause = result.error.cause

    if (!cause) {
      return result
    }

    SentryCaptureException(cause)
    throw cause
  }

  return result
})

export default captureErrors
