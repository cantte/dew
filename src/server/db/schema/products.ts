import { relations, sql } from 'drizzle-orm'
import {
  boolean,
  date,
  index,
  integer,
  real,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import { users } from '~/server/db/schema/auth'
import { createTable } from '~/server/db/schema/base'

export const units = createTable('unit', {
  id: uuid('id').notNull().primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp('updated_at').$onUpdateFn(() => new Date()),
  deletedAt: timestamp('deleted_at'),
})

export const products = createTable(
  'product',
  {
    id: uuid('id').notNull().primaryKey(),
    code: varchar('code', { length: 255 }).notNull(),
    reference: text('reference'),
    name: varchar('name', { length: 255 }),
    description: text('description'),
    purchasePrice: real('purchase_price').notNull(),
    salePrice: real('sale_price').notNull(),
    createdBy: varchar('created_by', { length: 255 })
      .notNull()
      .references(() => users.id),
    unitId: uuid('unit_id').references(() => units.id),
    enabled: boolean('enabled').notNull().default(true),
    createdAt: timestamp('created_at')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at').$onUpdateFn(() => new Date()),
    deletedAt: timestamp('deleted_at'),
  },
  (product) => ({
    createdByIdx: index('product_created_by_idx').on(product.createdBy),
  }),
)

export const productsRelations = relations(products, ({ one }) => ({
  user: one(users, {
    fields: [products.createdBy],
    references: [users.id],
  }),
}))

export const productsDiscounts = createTable(
  'product_discount',
  {
    id: uuid('id').notNull().primaryKey(),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id),
    isPercentage: boolean('is_percentage').notNull(),
    discount: real('discount').notNull(),
    startDate: date('start_date').notNull(),
    endDate: date('end_date').notNull(),
    createdBy: varchar('created_by', { length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp('created_at')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at').$onUpdateFn(() => new Date()),
    deletedAt: timestamp('deleted_at'),
  },
  (productDiscount) => ({
    productIdIdx: index('product_discount_product_id_idx').on(
      productDiscount.productId,
    ),
  }),
)

export const productSummaries = createTable(
  'product_summary',
  {
    id: uuid('id').notNull().primaryKey(),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id),
    sales: integer('sales').notNull(),
    amount: real('amount').notNull(),
    profit: real('profit').notNull(),
    createdAt: timestamp('created_at')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at').$onUpdateFn(() => new Date()),
  },
  (productSummary) => ({
    productIdIdx: unique('product_summary_product_id_idx').on(
      productSummary.productId,
    ),
  }),
)
