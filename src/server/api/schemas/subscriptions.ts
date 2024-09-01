import { z } from 'zod'

export const createSubscriptionInput = z.object({
  planId: z.enum(['dew_mensual', 'dew_anual']),
  card: z.object({
    number: z.string(),
    expMonth: z.string(),
    expYear: z.string(),
    cvc: z.string(),
  }),
  customer: z.object({
    name: z.string(),
    lastName: z.string(),
    email: z.string(),
    phone: z.string(),
    docType: z.string(),
    docNumber: z.string(),
  }),
})

export const updateSubscriptionInput = z.object({
  id: z.string(),
  status: z.enum(['active', 'past_due', 'inactive']),
})
