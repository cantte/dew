import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  primaryKey,
  real,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `${name}`);

export const users = createTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_userId_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
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

export const inventory = createTable(
  "inventory",
  {
    storeId: varchar("store_id", { length: 36 }).notNull(),
    productId: varchar("product_id", { length: 255 }).notNull(),
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

export const cashRegisters = createTable(
  "cash_register",
  {
    id: varchar("id", { length: 36 }).notNull().primaryKey(),
    amount: real("amount").notNull(),
    storeId: varchar("store_id", { length: 36 }).notNull(),
    createdBy: varchar("created_by", { length: 255 }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at").$onUpdateFn(() => new Date()),
  },
  (cashRegister) => ({
    storeIdIdx: index("cash_register_store_id_idx").on(cashRegister.storeId),
    createdByIdx: index("cash_register_created_by_idx").on(
      cashRegister.createdBy,
    ),
  }),
);

export const cashRegisterRelations = relations(cashRegisters, ({ one }) => ({
  store: one(stores, {
    fields: [cashRegisters.storeId],
    references: [stores.id],
  }),
  user: one(users, {
    fields: [cashRegisters.createdBy],
    references: [users.id],
  }),
}));

export const cashRegisterTransactions = createTable(
  "cash_register_transaction",
  {
    id: varchar("id", { length: 36 }).notNull().primaryKey(),
    amount: real("amount").notNull(),
    type: varchar("type", { length: 32 }).notNull(),
    cashRegisterId: varchar("cash_register_id", { length: 36 }).notNull(),
    createdBy: varchar("created_by", { length: 255 }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (cashRegisterTransaction) => ({
    cashRegisterIdIdx: index(
      "cash_register_transaction_cash_register_id_idx",
    ).on(cashRegisterTransaction.cashRegisterId),
    createdByIdx: index("created_by_idx").on(cashRegisterTransaction.createdBy),
  }),
);

export const cashRegisterTransactionRelations = relations(
  cashRegisterTransactions,
  ({ one }) => ({
    cashRegister: one(cashRegisters, {
      fields: [cashRegisterTransactions.cashRegisterId],
      references: [cashRegisters.id],
    }),
    user: one(users, {
      fields: [cashRegisterTransactions.createdBy],
      references: [users.id],
    }),
  }),
);

export const userPreferences = createTable("user_preference", {
  userId: varchar("user_id", { length: 255 }).notNull().primaryKey(),
  storeId: varchar("store_id", { length: 36 }).notNull(),
});

export const employees = createTable(
  "employee",
  {
    id: varchar("id", { length: 36 }).notNull().primaryKey(),
    name: varchar("name", { length: 128 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 32 }),
    createdBy: varchar("created_by", { length: 255 }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at").$onUpdateFn(() => new Date()),
  },
  (employee) => ({
    createdByIdx: index("employee_created_by_idx").on(employee.createdBy),
  }),
);

export const employeeRelations = relations(employees, ({ many }) => ({
  stores: many(stores),
}));

export const employeeStore = createTable(
  "employee_store",
  {
    employeeId: varchar("employee_id", { length: 36 }).notNull(),
    storeId: varchar("store_id", { length: 36 }).notNull(),
  },
  (employeeStore) => ({
    employeeIdIdx: index("employee_id_idx").on(employeeStore.employeeId),
    storeIdIdx: index("employee_store_store_id_idx").on(employeeStore.storeId),
  }),
);

export const employeeStoreRelations = relations(employeeStore, ({ one }) => ({
  employee: one(employees, {
    fields: [employeeStore.employeeId],
    references: [employees.id],
  }),
  store: one(stores, {
    fields: [employeeStore.storeId],
    references: [stores.id],
  }),
}));
