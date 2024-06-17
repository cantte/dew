import { relations, sql } from "drizzle-orm";
import { primaryKey, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { createTable } from "~/server/db/schema/base";

export const permissions = createTable("permission", {
  id: uuid("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").$onUpdateFn(() => new Date()),
});

export const roles = createTable("role", {
  id: uuid("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at").$onUpdateFn(() => new Date()),
});

export const rolePermission = createTable(
  "role_permission",
  {
    roleId: uuid("role_id")
      .notNull()
      .references(() => roles.id),
    permissionId: uuid("permission_id")
      .notNull()
      .references(() => permissions.id),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at").$onUpdateFn(() => new Date()),
  },
  (rolePermission) => ({
    compoundKey: primaryKey({
      columns: [rolePermission.roleId, rolePermission.permissionId],
    }),
  }),
);

export const rolePermissionRelations = relations(rolePermission, ({ one }) => ({
  role: one(roles, {
    fields: [rolePermission.roleId],
    references: [roles.id],
  }),
  permission: one(permissions, {
    fields: [rolePermission.permissionId],
    references: [permissions.id],
  }),
}));
