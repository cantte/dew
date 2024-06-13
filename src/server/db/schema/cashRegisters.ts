import { relations, sql } from "drizzle-orm";
import { index, real, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "~/server/db/schema/auth";
import { createTable } from "~/server/db/schema/base";
import { stores } from "~/server/db/schema/stores";

export const cashRegisters = createTable(
  "cash_register",
  {
    id: varchar("id", { length: 36 }).notNull().primaryKey(),
    amount: real("amount").notNull(),
    storeId: uuid("store_id")
      .notNull()
      .references(() => stores.id),
    createdBy: varchar("created_by", { length: 255 })
      .notNull()
      .references(() => users.id),
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
    cashRegisterId: varchar("cash_register_id", { length: 36 })
      .notNull()
      .references(() => cashRegisters.id),
    createdBy: varchar("created_by", { length: 255 })
      .notNull()
      .references(() => users.id),
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
