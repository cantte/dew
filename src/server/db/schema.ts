import { relations, sql } from "drizzle-orm";
import {
  float,
  index,
  int,
  mysqlTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mysqlTable = mysqlTableCreator((name) => `dew_${name}`);

export const users = mysqlTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    fsp: 3,
  }).default(sql`CURRENT_TIMESTAMP(3)`),
  image: varchar("image", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
}));

export const accounts = mysqlTable(
  "account",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: int("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
    userIdIdx: index("userId_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = mysqlTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = mysqlTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

export const products = mysqlTable(
  "product",
  {
    id: varchar("id", { length: 255 }).notNull().primaryKey(),
    name: varchar("name", { length: 255 }),
    description: text("description"),
    purchasePrice: float("purchasePrice").notNull(),
    salePrice: float("salePrice").notNull(),
    stock: int("stock").notNull(),
    quantity: int("quantity").notNull().default(0),
    createdBy: varchar("createdBy", { length: 255 }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (product) => ({
    idIdx: index("id_idx").on(product.id),
    createdByIdx: index("createdBy_idx").on(product.createdBy),
  }),
);

export const productsRelations = relations(products, ({ one }) => ({
  user: one(users, {
    fields: [products.createdBy],
    references: [users.id],
  }),
}));

export const customers = mysqlTable(
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
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (customer) => ({
    idIdx: index("id_idx").on(customer.id),
    createdByIdx: index("createdBy_idx").on(customer.createdBy),
  }),
);

export const sales = mysqlTable(
  "sale",
  {
    code: varchar("code", { length: 32 }).notNull().primaryKey(),
    customerId: varchar("customer_id", { length: 32 }).notNull(),
    amount: float("amount").notNull(),
    paymentMethod: varchar("payment_method", { length: 32 })
      .notNull()
      .default("cash"),
    payment: float("payment").notNull(),
    createdBy: varchar("created_by", { length: 255 }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (sale) => ({
    customerIdIdx: index("customer_id_idx").on(sale.customerId),
    createdByIdx: index("created_by_idx").on(sale.createdBy),
  }),
);

export const salesRelations = relations(sales, ({ one }) => ({
  customer: one(customers, {
    fields: [sales.customerId],
    references: [customers.id],
  }),
}));

export const saleItems = mysqlTable(
  "sale_item",
  {
    id: varchar("id", { length: 32 }).notNull().primaryKey(),
    saleCode: varchar("sale_code", { length: 32 }).notNull(),
    productId: varchar("product_id", { length: 255 }).notNull(),
    quantity: int("quantity").notNull(),
    purchasePrice: float("purchase_price").notNull(),
    salePrice: float("sale_price").notNull(),
    profit: float("profit").notNull(),
    createdBy: varchar("created_by", { length: 255 }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (saleItem) => ({
    idIdx: index("id_idx").on(saleItem.id),
    saleIdIdx: index("sale_code_idx").on(saleItem.saleCode),
    productIdIdx: index("product_id_idx").on(saleItem.productId),
    createdByIdx: index("created_by_idx").on(saleItem.createdBy),
  }),
);

export const saleItemsRelations = relations(saleItems, ({ one }) => ({
  sale: one(sales, { fields: [saleItems.saleCode], references: [sales.code] }),
  product: one(products, {
    fields: [saleItems.productId],
    references: [products.id],
  }),
}));
