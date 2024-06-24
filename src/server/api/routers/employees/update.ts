import { eq } from 'drizzle-orm'
import type { TypeOf } from 'zod'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import type { updateEmployeeInput } from '~/server/api/schemas/employees'
import { employees } from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
  input: TypeOf<typeof updateEmployeeInput>
}

const updateEmployee = async ({ ctx, input }: Options) => {
  await ctx.db.update(employees).set(input).where(eq(employees.id, input.id))
}

export default updateEmployee
