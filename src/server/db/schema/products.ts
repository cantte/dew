import { relations, sql } from "drizzle-orm";
import {
  boolean,
  date,
  index,
  real,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "~/server/db/schema/auth";
import { createTable } from "~/server/db/schema/base";

export const products = createTable(
  "product",
  {
    id: uuid("id").notNull().primaryKey(),
    code: varchar("code", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }),
    description: text("description"),
    purchasePrice: real("purchase_price").notNull(),
    salePrice: real("sale_price").notNull(),
    createdBy: varchar("created_by", { length: 255 })
      .notNull()
      .references(() => users.id),
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

export const productsDiscounts = createTable(
  "product_discount",
  {
    id: uuid("id").notNull().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id),
    isPercentage: boolean("is_percentage").notNull(),
    discount: real("discount").notNull(),
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    createdBy: varchar("created_by", { length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at").$onUpdateFn(() => new Date()),
    deletedAt: timestamp("deleted_at"),
  },
  (productDiscount) => ({
    productIdIdx: index("product_discount_product_id_idx").on(
      productDiscount.productId,
    ),
  }),
);
