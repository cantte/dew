import { relations } from 'drizzle-orm'
import { boolean, integer, primaryKey, uuid } from 'drizzle-orm/pg-core'
import { createTable } from '~/server/db/schema/base'
import { products } from '~/server/db/schema/products'
import { stores } from '~/server/db/schema/stores'

export const inventory = createTable(
  'inventory',
  {
    storeId: uuid('store_id')
      .notNull()
      .references(() => stores.id),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id),
    stock: integer('stock').notNull(),
    quantity: integer('quantity').notNull().default(0),
    lowStockNotificationSended: boolean('low_stock_notification_sended'),
  },
  (inventory) => ({
    compoundKey: primaryKey({
      columns: [inventory.storeId, inventory.productId],
    }),
  }),
)

export const inventoryRelations = relations(inventory, ({ one }) => ({
  store: one(stores, {
    fields: [inventory.storeId],
    references: [stores.id],
  }),
  product: one(products, {
    fields: [inventory.productId],
    references: [products.id],
  }),
}))
