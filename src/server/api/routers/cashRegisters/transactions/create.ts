import { eq } from "drizzle-orm";
import type { TypeOf } from "zod";
import uuid from "~/lib/uuid";
import type { TRPCAuthedContext } from "~/server/api/procedures/authed";
import type { createCashRegisterTransactionInput } from "~/server/api/schemas/cashRegisters";
import { cashRegisterTransactions, cashRegisters } from "~/server/db/schema";

type Options = {
  ctx: TRPCAuthedContext;
  input: TypeOf<typeof createCashRegisterTransactionInput>;
};

const createCashRegisterTransaction = async ({ ctx, input }: Options) => {
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
};

export default createCashRegisterTransaction;
