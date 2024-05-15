import { and, between, desc, eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { z } from "zod";

import {
  createCashRegisterInput,
  createCashRegisterTransactionInput,
} from "~/server/api/schemas/cashRegisters";
import { byStoreInput } from "~/server/api/schemas/common";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { cashRegisters, cashRegisterTransactions } from "~/server/db/schema";

export const cashRegistersRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createCashRegisterInput)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(cashRegisters).values({
        ...input,
        id: uuid(),
        amount: 0,
        createdBy: ctx.session.user.id,
      });
    }),
  find: protectedProcedure.input(byStoreInput).query(async ({ ctx, input }) => {
    return ctx.db.query.cashRegisters.findFirst({
      where: eq(cashRegisters.storeId, input.storeId),
    });
  }),
  transactions: createTRPCRouter({
    create: protectedProcedure
      .input(createCashRegisterTransactionInput)
      .mutation(async ({ ctx, input }) => {
        await ctx.db.transaction(async (tx) => {
          const [cashRegister] = await tx
            .select({
              amount: cashRegisters.amount,
            })
            .from(cashRegisters)
            .where(eq(cashRegisters.id, input.cashRegisterId));

          if (cashRegister === undefined) {
            try {
              tx.rollback();
            } catch (e) {
              throw new Error("Cash register not found");
            }
          }

          if (cashRegister === undefined) {
            throw new Error("Cash register not found");
          }

          if (input.type === "OUT" && cashRegister.amount < input.amount) {
            try {
              tx.rollback();
            } catch (e) {
              throw new Error("Insufficient cash register amount");
            }
          }

          await tx.insert(cashRegisterTransactions).values({
            ...input,
            id: uuid(),
            createdBy: ctx.session.user.id,
          });

          const newAmount =
            input.type === "IN"
              ? cashRegister.amount + input.amount
              : cashRegister.amount - input.amount;

          await tx
            .update(cashRegisters)
            .set({
              amount: newAmount,
            })
            .where(eq(cashRegisters.id, input.cashRegisterId));
        });
      }),
    list: protectedProcedure
      .input(
        z.object({
          cashRegisterId: z.string().min(1).max(36),
          from: z.coerce.date(),
          to: z.coerce.date(),
        }),
      )
      .query(async ({ ctx, input }) => {
        return ctx.db.query.cashRegisterTransactions.findMany({
          with: {
            user: true,
          },
          where: and(
            eq(cashRegisterTransactions.cashRegisterId, input.cashRegisterId),
            between(cashRegisterTransactions.createdAt, input.from, input.to),
          ),
          orderBy: [desc(cashRegisterTransactions.createdAt)],
        });
      }),
  }),
});
