import { relations, sql } from "drizzle-orm";
import { index, integer, real, timestamp, varchar } from "drizzle-orm/pg-core";
import { createTable } from "~/server/db/schema/base";
import { customers } from "~/server/db/schema/customers";
import { products } from "~/server/db/schema/products";
import { stores } from "~/server/db/schema/stores";

export const sales = createTable(
  "sale",
  {
    code: varchar("code", { length: 36 }).notNull().primaryKey(),
    customerId: varchar("customer_id", { length: 32 }).notNull(),
    amount: real("amount").notNull(),
    paymentMethod: varchar("payment_method", { length: 32 })
      .notNull()
      .default("cash"),
    payment: real("payment").notNull(),
    storeId: varchar("store_id", { length: 36 }).notNull(),
    createdBy: varchar("created_by", { length: 255 }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at").$onUpdateFn(() => new Date()),
  },
  (sale) => ({
    customerIdIdx: index("sale_customer_id_idx").on(sale.customerId),
    createdByIdx: index("sale_created_by_idx").on(sale.createdBy),
  }),
);

export const salesRelations = relations(sales, ({ one, many }) => ({
  customer: one(customers, {
    fields: [sales.customerId],
    references: [customers.id],
  }),
  saleItems: many(saleItems),
  store: one(stores, { fields: [sales.storeId], references: [stores.id] }),
}));

export const saleItems = createTable(
  "sale_item",
  {
    id: varchar("id", { length: 36 }).notNull().primaryKey(),
    saleCode: varchar("sale_code", { length: 36 }).notNull(),
    productId: varchar("product_id", { length: 255 }).notNull(),
    quantity: integer("quantity").notNull(),
    purchasePrice: real("purchase_price").notNull(),
    salePrice: real("sale_price").notNull(),
    profit: real("profit").notNull(),
    createdBy: varchar("created_by", { length: 255 }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at").$onUpdateFn(() => new Date()),
  },
  (saleItem) => ({
    saleIdIdx: index("sale_item_sale_code_idx").on(saleItem.saleCode),
    productIdIdx: index("sale_item_product_id_idx").on(saleItem.productId),
    createdByIdx: index("sale_item_created_by_idx").on(saleItem.createdBy),
  }),
);

export const saleItemsRelations = relations(saleItems, ({ one }) => ({
  sale: one(sales, { fields: [saleItems.saleCode], references: [sales.code] }),
  product: one(products, {
    fields: [saleItems.productId],
    references: [products.id],
  }),
}));
