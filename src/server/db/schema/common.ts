import { pgEnum } from 'drizzle-orm/pg-core'

export const paymentMethods = pgEnum('payment_method', [
  'cash',
  'creditCard',
  'debitCard',
  'transfer',
])
