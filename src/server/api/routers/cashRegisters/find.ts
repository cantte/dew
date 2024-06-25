import { eq } from 'drizzle-orm'
import type { TypeOf } from 'zod'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import type { byStoreInput } from '~/server/api/schemas/common'
import { cashRegisters } from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
  input: TypeOf<typeof byStoreInput>
}

const findCashRegister = async ({ ctx, input }: Options) => {
  return ctx.db.query.cashRegisters.findFirst({
    where: eq(cashRegisters.storeId, input.storeId),
  })
}

export default findCashRegister
