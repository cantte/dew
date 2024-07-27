import { eq } from 'drizzle-orm'
import type { TypeOf } from 'zod'
import uuid from '~/lib/uuid'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import type { makeCashMovementInput } from '~/server/api/schemas/cashRegisters'
import { cashRegisterTransactions, cashRegisters } from '~/server/db/schema'

type DbTransaction = Parameters<
  Parameters<TRPCAuthedContext['db']['transaction']>[0]
>[0]

type Options = {
  tx: DbTransaction
  input: TypeOf<typeof makeCashMovementInput>
}

export const makeCashMovement = async ({ tx, input }: Options) => {
  const [cashRegister] = await tx
    .select({
      id: cashRegisters.id,
      amount: cashRegisters.amount,
    })
    .from(cashRegisters)
    .where(eq(cashRegisters.storeId, input.storeId))

  if (!cashRegister) {
    tx.rollback()
    throw new Error('Cash register not found')
  }

  const newAmount =
    input.type === 'in'
      ? cashRegister.amount + input.amount
      : cashRegister.amount - input.amount

  if (newAmount < 0) {
    tx.rollback()
    throw new Error('Insufficient cash register amount')
  }

  const cashRegisterTransaction = {
    id: uuid(),
    cashRegisterId: cashRegister.id,
    amount: input.amount,
    type: input.type,
    createdBy: input.userId,
  }

  await tx.insert(cashRegisterTransactions).values(cashRegisterTransaction)

  await tx
    .update(cashRegisters)
    .set({
      amount: newAmount,
    })
    .where(eq(cashRegisters.id, cashRegister.id))
}
