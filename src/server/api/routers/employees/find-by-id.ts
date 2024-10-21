import { eq, or } from 'drizzle-orm'
import type { TypeOf } from 'zod'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import type { findEmployeeInput } from '~/server/api/schemas/employees'
import { employees } from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
  input: TypeOf<typeof findEmployeeInput>
}

export const findEmployeeById = async ({ ctx, input }: Options) => {
  const [employee] = await ctx.db
    .select({
      id: employees.id,
      code: employees.code,
      name: employees.name,
      email: employees.email,
      phone: employees.phone,
    })
    .from(employees)
    .where(or(eq(employees.userId, input.code), eq(employees.id, input.code)))
    .limit(1)

  return employee
}
