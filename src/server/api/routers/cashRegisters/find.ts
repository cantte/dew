import { eq, sql } from 'drizzle-orm'
import type { TypeOf } from 'zod'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import type { byStoreInput } from '~/server/api/schemas/common'
import { cashRegisterTransactions, cashRegisters } from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
  input: TypeOf<typeof byStoreInput>
}

const findCashRegister = async ({ ctx, input }: Options) => {
  const [cashRegister] = await ctx.db
    .select({
      id: cashRegisters.id,
      amount: cashRegisters.amount,
      createdAt: cashRegisters.createdAt,
      inAmount: sql<number>`sum(${cashRegisterTransactions.amount}) filter (where ${cashRegisterTransactions.type} = 'in')`,
      outAmount: sql<number>`sum(${cashRegisterTransactions.amount}) filter (where ${cashRegisterTransactions.type} = 'out')`,
    })
    .from(cashRegisters)
    .leftJoin(
      cashRegisterTransactions,
      eq(cashRegisters.id, cashRegisterTransactions.cashRegisterId),
    )
    .groupBy(cashRegisters.id)
    .where(eq(cashRegisters.storeId, input.storeId))
    .limit(1)

  return cashRegister
}

export default findCashRegister
