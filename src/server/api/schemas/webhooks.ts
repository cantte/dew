import { z } from 'zod'

export const createWebhookInput = z.object({
  name: z.string(),
  body: z.string(),
})
