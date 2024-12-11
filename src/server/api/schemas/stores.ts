import { z } from 'zod'

export const createStoreInput = z.object({
  name: z.string().min(1, 'not_empty_string').max(64, 'too_long_string'),
  address: z.string().min(1, 'not_empty_string').max(64, 'too_long_string'),
  phone: z.string().min(1).max(32).optional(),
  nit: z.string().min(10).max(32).optional(),
})

export const findStoreInput = z.object({
  id: z.string().min(1).max(36),
})

export const updateStoreInput = createStoreInput.extend({
  id: z.string().min(1).max(36),
})

export const deleteEmployeeStoreInput = z.object({
  storeId: z.string().min(1).max(36),
  employeeId: z.string().min(1).max(36),
})
