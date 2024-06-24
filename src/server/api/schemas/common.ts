import { z } from 'zod'

export const byStoreInput = z.object({ storeId: z.string().uuid() })
