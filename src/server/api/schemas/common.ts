import { type TypeOf, z } from 'zod'

export const byStoreInput = z.object({ storeId: z.string().uuid() })

export const paymentMethod = z.enum([
  'cash',
  'creditCard',
  'debitCard',
  'transfer',
] as const)

export type PaymentMethod = TypeOf<typeof paymentMethod>
