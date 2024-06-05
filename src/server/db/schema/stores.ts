import { relations, sql } from "drizzle-orm";
import { index, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { users } from "~/server/db/schema/auth";
import { createTable } from "~/server/db/schema/base";
import { employees } from "~/server/db/schema/employees";

export const stores = createTable(
  "store",
  {
    id: varchar("id", { length: 36 }).notNull().primaryKey(),
    name: varchar("name", { length: 128 }).notNull(),
    address: text("address"),
    phone: varchar("phone", { length: 32 }),
    createdBy: varchar("created_by", { length: 255 }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at").$onUpdateFn(() => new Date()),
  },
  (store) => ({
    createdByIdx: index("store_created_by_idx").on(store.createdBy),
  }),
);

export const storeRelations = relations(stores, ({ one, many }) => ({
  user: one(users, {
    fields: [stores.createdBy],
    references: [users.id],
  }),
  employees: many(employees),
}));
