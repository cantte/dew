import { eq } from 'drizzle-orm'
import type { TypeOf } from 'zod'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import { makeCashMovement } from '~/server/api/routers/cashRegisters/make-cash-movement'
import type { createCashRegisterTransactionInput } from '~/server/api/schemas/cashRegisters'
import { cashRegisters } from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
  input: TypeOf<typeof createCashRegisterTransactionInput>
}

const createCashRegisterTransaction = async ({ ctx, input }: Options) => {
  await ctx.db.transaction(async (tx) => {
    const [cashRegister] = await tx
      .select({
        storeId: cashRegisters.storeId,
      })
      .from(cashRegisters)
      .where(eq(cashRegisters.id, input.cashRegisterId))

    if (cashRegister === undefined) {
      throw new Error('Cash register not found')
    }

    await makeCashMovement({
      tx,
      input: {
        storeId: cashRegister.storeId,
        type: input.type,
        amount: input.amount,
        userId: ctx.session.user.id,
      },
    })
  })
}

export default createCashRegisterTransaction
