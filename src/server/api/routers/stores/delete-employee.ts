import { and, eq } from 'drizzle-orm'
import type { TypeOf } from 'zod'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import type { deleteEmployeeStoreInput } from '~/server/api/schemas/stores'
import { employeeStore } from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
  input: TypeOf<typeof deleteEmployeeStoreInput>
}

export const deleteEmployeeStore = async ({ ctx, input }: Options) => {
  const result = await ctx.db
    .delete(employeeStore)
    .where(
      and(
        eq(employeeStore.storeId, input.storeId),
        eq(employeeStore.employeeId, input.employeeId),
      ),
    )

  return result.length > 0
}
