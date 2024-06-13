import { sql } from "drizzle-orm";
import { timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { createTable } from "~/server/db/schema/base";
import { employees } from "~/server/db/schema/employees";
import { stores } from "~/server/db/schema/stores";

export const permission = createTable("permission", {
  id: uuid("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").$onUpdateFn(() => new Date()),
});

export const role = createTable("role", {
  id: uuid("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").$onUpdateFn(() => new Date()),
});

export const rolePermission = createTable("role_permission", {
  roleId: uuid("role_id")
    .notNull()
    .references(() => role.id),
  permissionId: uuid("permission_id")
    .notNull()
    .references(() => permission.id),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").$onUpdateFn(() => new Date()),
});

export const employeeStoreRole = createTable("employee_store_role", {
  employeeId: uuid("employee_id")
    .notNull()
    .references(() => employees.id),
  storeId: uuid("store_id")
    .notNull()
    .references(() => stores.id),
  roleId: uuid("role_id")
    .notNull()
    .references(() => role.id),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").$onUpdateFn(() => new Date()),
});
