import { addDays } from 'date-fns'
import type { TypeOf } from 'zod'
import uuid from '~/lib/uuid'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import { generateEmployeeInvitationLink } from '~/server/api/routers/employees/generate-invitation-link'
import { sendEmployeeInvitationLink } from '~/server/api/routers/employees/send-invitation-link'
import findStore from '~/server/api/routers/stores/find'
import type { createEmployeeInput } from '~/server/api/schemas/employees'
import { employeeStoreInvitationTokens, employees } from '~/server/db/schema'

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

    const invitationToken = uuid()
    const tokenExpiresAt = addDays(new Date(), 7)

    await tx.insert(employeeStoreInvitationTokens).values({
      employeeId: employeeId,
      storeId: input.storeId,
      token: invitationToken,
      expiresAt: tokenExpiresAt,
    })

    const invitationLink = generateEmployeeInvitationLink(invitationToken)
    const store = await findStore({ ctx, input: { id: input.storeId } })

    if (!store) {
      throw new Error('Store not found')
    }

    await sendEmployeeInvitationLink({
      name: data.name,
      email: data.email,
      invitationLink,
      storeName: store.name,
    })
  })
}

export default createEmployee
