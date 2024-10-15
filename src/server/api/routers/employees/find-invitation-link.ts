import { and, eq, isNull, lt, sql } from 'drizzle-orm'
import type { TypeOf } from 'zod'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import type { findInvitationLinkInput } from '~/server/api/schemas/employees'
import {
  employeeStoreInvitationTokens,
  employees,
  stores,
} from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
  input: TypeOf<typeof findInvitationLinkInput>
}

export const findInvitationLink = async ({ ctx, input }: Options) => {
  const [invitationLink] = await ctx.db
    .select({
      token: employeeStoreInvitationTokens.token,
      employee: {
        id: employees.id,
        name: employees.name,
        email: employees.email,
      },
      store: {
        id: stores.id,
        name: stores.name,
      },
    })
    .from(employeeStoreInvitationTokens)
    .innerJoin(
      employees,
      eq(employees.id, employeeStoreInvitationTokens.employeeId),
    )
    .innerJoin(stores, eq(stores.id, employeeStoreInvitationTokens.storeId))
    .where(
      and(
        eq(employeeStoreInvitationTokens.token, input.token),
        lt(employeeStoreInvitationTokens.expiresAt, sql`CURRENT_TIMESTAMP`),
        isNull(employeeStoreInvitationTokens.usedAt),
      ),
    )

  return invitationLink
}
