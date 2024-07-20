import { z } from 'zod'

export const createCashRegisterInput = z.object({
  storeId: z.string().min(1).max(36),
})

export const createCashRegisterTransactionInput = z.object({
  cashRegisterId: z.string().min(1).max(36),
  amount: z.coerce.number().min(1),
  type: z.enum(['IN', 'OUT']),
})

export const listCashRegisterTransactionsInput = z.object({
  cashRegisterId: z.string().min(1).max(36),
  from: z.coerce.date(),
  to: z.coerce.date(),
})

export const makeCashMovementInput = z.object({
  storeId: z.string().min(1).max(36),
  userId: z.string().min(1).max(36),
  type: z.enum(['IN', 'OUT']),
  amount: z.coerce.number().min(1),
})
