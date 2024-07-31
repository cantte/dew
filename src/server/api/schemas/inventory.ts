import { z } from 'zod'

export const updateInventoryInput = z.object({
  id: z.string(),
  stock: z.coerce.number().min(1),
  quantity: z.coerce.number().min(0),
  operation: z.enum(['add', 'remove']),
})

export const findInventoryInput = z.object({
  id: z.string().uuid(),
  storeId: z.string().uuid(),
})

export const makeInventoryAdjustmentInput = z.object({
  storeId: z.string().uuid(),
  userId: z.string().uuid(),
  products: z.array(
    z.object({
      productId: z.string().uuid(),
      quantity: z.coerce.number().min(1),
      type: z.enum(['in', 'out']),
    }),
  ),
})

export enum InventoryAdjustmentType {
  In = 'in',
  Out = 'out',
}
