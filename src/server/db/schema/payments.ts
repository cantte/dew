import { relations } from 'drizzle-orm'
import { text, uuid, varchar } from 'drizzle-orm/pg-core'
import { users } from '~/server/db/schema/auth'
import { createTable } from '~/server/db/schema/base'

export const userPayments = createTable('user_payment', {
  id: uuid('id').notNull().primaryKey(),
  userId: varchar('user_id', { length: 255 })
    .notNull()
    .references(() => users.id),
  customerId: text('customer_id'),
  cardToken: text('card_token'),
})

export const userPaymentsRelations = relations(userPayments, ({ one }) => ({
  user: one(users, {
    fields: [userPayments.userId],
    references: [users.id],
  }),
}))
