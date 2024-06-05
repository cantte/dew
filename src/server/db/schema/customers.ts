import { sql } from "drizzle-orm";
import { index, timestamp, varchar } from "drizzle-orm/pg-core";
import { createTable } from "~/server/db/schema/base";

export const customers = createTable(
  "customer",
  {
    id: varchar("id", { length: 32 }).notNull().primaryKey(),
    name: varchar("name", { length: 128 }).notNull(),
    email: varchar("email", { length: 255 }),
    phone: varchar("phone", { length: 32 }),
    createdBy: varchar("created_by", { length: 255 }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at").$onUpdateFn(() => new Date()),
  },
  (customer) => ({
    createdByIdx: index("customer_created_by_idx").on(customer.createdBy),
  }),
);
