import { relations, sql } from 'drizzle-orm'
import { pgEnum, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { users } from '~/server/db/schema/auth'
import { createTable } from '~/server/db/schema/base'

export const subcriptionStatuses = pgEnum('subcription_status', [
  'active',
  'past_due',
  'inactive',
])

export const subcriptions = createTable('subcription', {
  id: uuid('id').notNull().primaryKey(),
  status: subcriptionStatuses('status').notNull(),
  periodEnd: timestamp('period_end').notNull(),
  planId: text('plan_id'),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp('updated_at').$onUpdateFn(() => new Date()),
})

export const subcriptionsRelations = relations(subcriptions, ({ one }) => ({
  user: one(users, {
    fields: [subcriptions.userId],
    references: [users.id],
  }),
}))
