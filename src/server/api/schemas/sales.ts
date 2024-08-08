import { z } from 'zod'
import { paymentMethod } from '~/server/api/schemas/common'

export const createSaleItemInput = z.object({
  productId: z.string().min(1).max(64),
  quantity: z.coerce.number().min(0),
  purchasePrice: z.coerce.number().min(0),
  salePrice: z.coerce.number().min(0),
  profit: z.coerce.number().min(0),
})

export const createSaleInput = z
  .object({
    customerId: z.string().min(1).max(32),
    amount: z.coerce.number().min(0),
    status: z.enum(['pending', 'paid'] as const),
    paymentMethod: paymentMethod,
    payment: z.coerce.number().min(0),
    storeId: z.string().uuid(),
    employeeId: z.string().uuid(),

    items: z.array(createSaleItemInput).min(1),
  })
  .refine((data) => data.payment >= data.amount, {
    message: 'El monto de pago debe ser mayor o igual al monto total',
    path: ['payment'],
  })

export const getSalesOverviewInput = z.object({
  from: z.coerce.date(),
  to: z.coerce.date(),
  storeId: z.string().min(1).max(36),
})

export const findSaleInput = z.object({ code: z.string() })

export const upsertSaleSummaryInput = z.object({
  date: z.date(),
  amount: z.coerce.number().min(0),
  profit: z.coerce.number().min(0),
  products: z.coerce.number().min(0),
  customers: z.coerce.number().min(0),
  sales: z.coerce.number().min(0),
  storeId: z.string().uuid(),
})
