import { z } from 'zod'

export const createSubscriptionInput = z.object({
  planId: z.string(),
})

export const updateSubscriptionInput = z.object({
  id: z.string(),
  status: z.enum(['active', 'past_due', 'inactive']),
})
