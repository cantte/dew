import { relations, sql } from 'drizzle-orm'
import {
  primaryKey,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import { users } from '~/server/db/schema/auth'
import { createTable } from '~/server/db/schema/base'
import { roles } from '~/server/db/schema/rbac'
import { stores } from '~/server/db/schema/stores'

export const employees = createTable('employee', {
  id: uuid('id').notNull().primaryKey(),
  code: varchar('code', { length: 32 }).unique(),
  name: varchar('name', { length: 128 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 32 }).unique(),
  userId: varchar('user_id', { length: 255 }).references(() => users.id),
  createdBy: varchar('created_by', { length: 255 })
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp('updated_at').$onUpdateFn(() => new Date()),
  deletedAt: timestamp('deleted_at'),
})

export const employeeRelations = relations(employees, ({ many, one }) => ({
  stores: many(stores),
  user: one(users, { fields: [employees.userId], references: [users.id] }),
}))

export const employeeStore = createTable(
  'employee_store',
  {
    employeeId: uuid('employee_id')
      .notNull()
      .references(() => employees.id),
    storeId: uuid('store_id')
      .notNull()
      .references(() => stores.id),
    roleId: uuid('role_id')
      .notNull()
      .references(() => roles.id),
    createdAt: timestamp('created_at')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at').$onUpdateFn(() => new Date()),
  },
  (employeeStore) => ({
    compoundKey: primaryKey({
      columns: [
        employeeStore.storeId,
        employeeStore.employeeId,
        employeeStore.roleId,
      ],
    }),
  }),
)

export const employeeStoreRelations = relations(employeeStore, ({ one }) => ({
  employee: one(employees, {
    fields: [employeeStore.employeeId],
    references: [employees.id],
  }),
  store: one(stores, {
    fields: [employeeStore.storeId],
    references: [stores.id],
  }),
  role: one(roles, {
    fields: [employeeStore.roleId],
    references: [roles.id],
  }),
}))

export const employeeStoreInvitationTokens = createTable(
  'employee_store_invitation_token',
  {
    id: serial('id').notNull().primaryKey(),
    employeeId: uuid('employee_id')
      .notNull()
      .references(() => employees.id),
    storeId: uuid('store_id')
      .notNull()
      .references(() => stores.id),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    usedAt: timestamp('used_at'),
  },
)
