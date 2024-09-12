import { sql } from 'drizzle-orm'
import { boolean, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { createTable } from '~/server/db/schema/base'

export const webhooksEvents = createTable('webhook_event', {
  id: uuid('id').notNull().primaryKey(),
  name: text('name').notNull(),
  processed: boolean('processed').default(false).notNull(),
  body: text('body').notNull(),
  error: text('error'),

  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp('updated_at').$onUpdateFn(() => new Date()),
})
