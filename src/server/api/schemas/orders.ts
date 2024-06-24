import { z } from 'zod'

export const createOrderItemInput = z.object({
  productId: z.string().min(1).max(64),
  quantity: z.coerce.number().min(0),
  purchasePrice: z.coerce.number().min(0),
  salePrice: z.coerce.number().min(0),
  profit: z.coerce.number().min(0),
})

export const createOrderInput = z.object({
  customerId: z.string().min(1).max(32),
  storeId: z.string().min(1).max(36),
  amount: z.coerce.number().min(0),
  paymentMethod: z.enum([
    'Cash',
    'CreditCard',
    'DebitCard',
    'Transfer',
  ] as const),
  payment: z.coerce.number().min(0),
  address: z.string().min(1).max(255),
  phone: z.string().min(1).max(32),

  items: z.array(createOrderItemInput).min(1),
})

export const byOrderIdInput = z.object({
  id: z.string().uuid(),
})

export const upsertOrderSummaryInput = z.object({
  date: z.date(),
  amount: z.coerce.number().min(0),
  profit: z.coerce.number().min(0),
  products: z.coerce.number().min(0),
  storeId: z.string().uuid(),
})

export const getOrderOverviewInput = z.object({
  storeId: z.string().uuid(),
  from: z.date(),
  to: z.date(),
})
