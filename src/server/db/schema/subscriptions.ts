import { relations, sql } from 'drizzle-orm'
import { pgEnum, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { users } from '~/server/db/schema/auth'
import { createTable } from '~/server/db/schema/base'

export const subscriptionsStatuses = pgEnum('subcription_status', [
  'active',
  'past_due',
  'inactive',
])

export const subscriptions = createTable('subscription', {
  id: uuid('id').notNull().primaryKey(),
  status: subscriptionsStatuses('status').notNull(),
  periodEnd: timestamp('period_end').notNull(),
  planId: text('plan_id'),
  userId: varchar('user_id', { length: 255 })
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp('updated_at').$onUpdateFn(() => new Date()),
})

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
}))
