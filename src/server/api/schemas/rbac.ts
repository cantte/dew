import { z } from 'zod'

export const checkPermissionsInput = z.object({
  permissions: z.array(z.string()),
})
