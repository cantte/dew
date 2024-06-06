import { v4 as uuid } from "uuid";
import type { TypeOf } from "zod";
import type { TRPCAuthedContext } from "~/server/api/procedures/authed";
import type { createCashRegisterInput } from "~/server/api/schemas/cashRegisters";
import { cashRegisters } from "~/server/db/schema";

type Options = {
  ctx: TRPCAuthedContext;
  input: TypeOf<typeof createCashRegisterInput>;
};

const createCashRegister = async ({ ctx, input }: Options) => {
  await ctx.db.insert(cashRegisters).values({
    ...input,
    id: uuid(),
    amount: 0,
    createdBy: ctx.session.user.id,
  });
};

export default createCashRegister;
