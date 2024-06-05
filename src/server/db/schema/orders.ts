import { relations, sql } from "drizzle-orm";
import {
    index,
    integer,
    pgEnum,
    real,
    text,
    timestamp,
    varchar,
} from "drizzle-orm/pg-core";
import { createTable } from "~/server/db/schema/base";
import { customers } from "~/server/db/schema/customers";
import { products } from "~/server/db/schema/products";
import { stores } from "~/server/db/schema/stores";

export const orderStatuses = pgEnum("order_status", [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]);

export const orders = createTable(
  "order",
  {
    id: varchar("id", { length: 36 }).notNull().primaryKey(),
    customerId: varchar("customer_id", { length: 32 }).notNull(),
    storeId: varchar("store_id", { length: 36 }).notNull(),
    amount: real("amount").notNull(),
    paymentMethod: varchar("payment_method", { length: 32 })
      .notNull()
      .default("cash"),
    payment: real("payment").notNull(),
    status: orderStatuses("status").notNull().default("pending"),
    address: text("address"),
    phone: varchar("phone", { length: 32 }),
    createdBy: varchar("created_by", { length: 255 }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at").$onUpdateFn(() => new Date()),
  },
  (order) => ({
    customerIdIdx: index("order_customer_id_idx").on(order.customerId),
    storeIdIdx: index("order_store_id_idx").on(order.storeId),
    createdByIdx: index("order_created_by_idx").on(order.createdBy),
  }),
);

export const orderRelations = relations(orders, ({ one, many }) => ({
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
  store: one(stores, {
    fields: [orders.storeId],
    references: [stores.id],
  }),
  orderItems: many(orderItems),
}));

export const orderItems = createTable(
  "order_item",
  {
    id: varchar("id", { length: 36 }).notNull().primaryKey(),
    orderId: varchar("order_id", { length: 36 }).notNull(),
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
  (orderItem) => ({
    orderIdIdx: index("order_item_order_id_idx").on(orderItem.orderId),
    productIdIdx: index("order_item_product_id_idx").on(orderItem.productId),
    createdByIdx: index("order_item_created_by_idx").on(orderItem.createdBy),
  }),
);

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));
