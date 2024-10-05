import { addDays } from 'date-fns'
import { eq } from 'drizzle-orm'
import type { TypeOf } from 'zod'
import uuid from '~/lib/uuid'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import type { createEmployeeInput } from '~/server/api/schemas/employees'
import {
  employeeStore,
  employeeStoreInvitationTokens,
  employees,
  roles,
} from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
  input: TypeOf<typeof createEmployeeInput>
}

const createEmployee = async ({ ctx, input }: Options) => {
  const { storeId, ...data } = input

  await ctx.db.transaction(async (tx) => {
    const employeeId = uuid()

    await tx
      .insert(employees)
      .values({
        ...data,
        id: employeeId,
        createdBy: ctx.session.user.id,
      })
      .onConflictDoUpdate({
        target: employees.code,
        set: {
          name: data.name,
          email: data.email,
          phone: data.phone,
        },
      })

    // After creating an employee, link to store
    const employeeRole = await tx.query.roles.findFirst({
      columns: {
        id: true,
      },
      where: eq(roles.name, 'employee'),
    })

    if (!employeeRole) {
      throw new Error('Employee role not found')
    }

    const invitationToken = uuid()
    const tokenExpiresAt = addDays(new Date(), 7)

    await tx.insert(employeeStoreInvitationTokens).values({
      employeeId: employeeId,
      storeId: input.storeId,
      token: invitationToken,
      expiresAt: tokenExpiresAt,
    })

    // TODO: Send email with invitation token and remove this link
    await tx
      .insert(employeeStore)
      .values({
        employeeId: employeeId,
        storeId: input.storeId,
        roleId: employeeRole.id,
      })
      .onConflictDoNothing()
  })
}

export default createEmployee
