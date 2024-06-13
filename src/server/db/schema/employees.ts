import { relations, sql } from "drizzle-orm";
import {
  index,
  primaryKey,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "~/server/db/schema/auth";
import { createTable } from "~/server/db/schema/base";
import { stores } from "~/server/db/schema/stores";

export const employees = createTable(
  "employee",
  {
    id: varchar("id", { length: 36 }).notNull().primaryKey(),
    name: varchar("name", { length: 128 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 32 }),
    userId: varchar("user_id", { length: 255 }).references(() => users.id),
    createdBy: varchar("created_by", { length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at").$onUpdateFn(() => new Date()),
  },
  (employee) => ({
    createdByIdx: index("employee_created_by_idx").on(employee.createdBy),
    uniqueEmail: unique("employee_email_unique").on(employee.email),
  }),
);

export const employeeRelations = relations(employees, ({ many, one }) => ({
  stores: many(stores),
  user: one(users, { fields: [employees.userId], references: [users.id] }),
}));

export const employeeStore = createTable(
  "employee_store",
  {
    employeeId: varchar("employee_id", { length: 36 })
      .notNull()
      .references(() => employees.id),
    storeId: uuid("store_id")
      .notNull()
      .references(() => stores.id),
  },
  (employeeStore) => ({
    compoundKey: primaryKey({
      columns: [employeeStore.storeId, employeeStore.employeeId],
    }),
  }),
);

export const employeeStoreRelations = relations(employeeStore, ({ one }) => ({
  employee: one(employees, {
    fields: [employeeStore.employeeId],
    references: [employees.id],
  }),
  store: one(stores, {
    fields: [employeeStore.storeId],
    references: [stores.id],
  }),
}));
