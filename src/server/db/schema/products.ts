import { relations, sql } from "drizzle-orm";
import { index, real, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { users } from "~/server/db/schema/auth";
import { createTable } from "~/server/db/schema/base";

export const products = createTable(
  "product",
  {
    id: varchar("id", { length: 255 }).notNull().primaryKey(),
    code: varchar("code", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }),
    description: text("description"),
    purchasePrice: real("purchase_price").notNull(),
    salePrice: real("sale_price").notNull(),
    createdBy: varchar("created_by", { length: 255 }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at").$onUpdateFn(() => new Date()),
    deletedAt: timestamp("deleted_at"),
  },
  (product) => ({
    createdByIdx: index("product_created_by_idx").on(product.createdBy),
  }),
);

export const productsRelations = relations(products, ({ one }) => ({
  user: one(users, {
    fields: [products.createdBy],
    references: [users.id],
  }),
}));
