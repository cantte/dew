import { and, between, desc, eq } from 'drizzle-orm'
import type { TypeOf } from 'zod'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import type { listCashRegisterTransactionsInput } from '~/server/api/schemas/cashRegisters'
import { cashRegisterTransactions } from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
  input: TypeOf<typeof listCashRegisterTransactionsInput>
}

const listCashRegisterTransactions = async ({ ctx, input }: Options) => {
  return await ctx.db.query.cashRegisterTransactions.findMany({
    with: {
      user: true,
    },
    where: and(
      eq(cashRegisterTransactions.cashRegisterId, input.cashRegisterId),
      between(cashRegisterTransactions.createdAt, input.from, input.to),
    ),
    orderBy: [desc(cashRegisterTransactions.createdAt)],
  })
}

export default listCashRegisterTransactions
