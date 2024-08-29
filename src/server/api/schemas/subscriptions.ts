import { z } from 'zod'

export const createSubscriptionInput = z.object({
  planId: z.string(),
})
