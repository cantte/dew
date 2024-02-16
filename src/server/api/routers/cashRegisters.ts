import { and, between, eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { z } from "zod";

import {
  createCashRegisterInput,
  createCashRegisterTransactionInput,
} from "~/server/api/schemas/cashRegisters";
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
  find: protectedProcedure
    .input(z.object({ storeId: z.string().min(1).max(36) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.cashRegisters.findFirst({
        where: and(
          eq(cashRegisters.storeId, input.storeId),
          eq(cashRegisters.createdBy, ctx.session.user.id),
        ),
      });
    }),
  transactions: createTRPCRouter({
    create: protectedProcedure
      .input(createCashRegisterTransactionInput)
      .mutation(async ({ ctx, input }) => {
        await ctx.db.insert(cashRegisterTransactions).values({
          ...input,
          id: uuid(),
          createdBy: ctx.session.user.id,
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
          where: and(
            eq(cashRegisterTransactions.cashRegisterId, input.cashRegisterId),
            between(cashRegisterTransactions.createdAt, input.from, input.to),
          ),
        });
      }),
  }),
});
