import { eq, sql } from 'drizzle-orm'
import type { TypeOf } from 'zod'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import { findInvitationLink } from '~/server/api/routers/employees/find-invitation-link'
import type { findInvitationLinkInput } from '~/server/api/schemas/employees'
import {
  employeeStore,
  employeeStoreInvitationTokens,
  employees,
  roles,
} from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
  input: TypeOf<typeof findInvitationLinkInput>
}

export const acceptInvitationLink = async ({ ctx, input }: Options) => {
  const invitationLink = await findInvitationLink({ ctx, input })

  if (!invitationLink) {
    throw new Error('Invitation link not found')
  }

  const employeeRole = await ctx.db.query.roles.findFirst({
    columns: {
      id: true,
    },
    where: eq(roles.name, 'employee'),
  })

  if (!employeeRole) {
    throw new Error('Employee role not found')
  }

  await ctx.db.transaction(async (tx) => {
    await tx.insert(employeeStore).values({
      employeeId: invitationLink.employee.id,
      storeId: invitationLink.store.id,
      roleId: employeeRole.id,
    })

    await tx
      .update(employeeStoreInvitationTokens)
      .set({
        usedAt: sql`CURRENT_TIMESTAMP`,
      })
      .where(eq(employeeStoreInvitationTokens.token, input.token))

    await tx
      .update(employees)
      .set({
        userId: ctx.session.user.id,
      })
      .where(eq(employees.id, invitationLink.employee.id))
  })

  return invitationLink
}
