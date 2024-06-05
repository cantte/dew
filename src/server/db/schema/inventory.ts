import { relations } from "drizzle-orm";
import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { createTable } from "~/server/db/schema/base";
import { products } from "~/server/db/schema/products";
import { stores } from "~/server/db/schema/stores";

export const inventory = createTable(
  "inventory",
  {
    storeId: varchar("store_id", { length: 36 })
      .notNull()
      .references(() => stores.id),
    productId: varchar("product_id", { length: 255 })
      .notNull()
      .references(() => products.id),
    stock: integer("stock").notNull(),
    quantity: integer("quantity").notNull().default(0),
  },
  (inventory) => ({
    compoundKey: primaryKey({
      columns: [inventory.storeId, inventory.productId],
    }),
  }),
);

export const inventoryRelations = relations(inventory, ({ one }) => ({
  store: one(stores, {
    fields: [inventory.storeId],
    references: [stores.id],
  }),
  product: one(products, {
    fields: [inventory.productId],
    references: [products.id],
  }),
}));
