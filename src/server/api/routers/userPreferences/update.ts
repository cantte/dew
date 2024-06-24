import { eq } from 'drizzle-orm'
import type { TypeOf } from 'zod'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import type { updateUserPreferencesInput } from '~/server/api/schemas/userPreferences'
import { userPreferences } from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
  input: TypeOf<typeof updateUserPreferencesInput>
}

const updateUserPreference = async ({ ctx, input }: Options) => {
  return await ctx.db
    .update(userPreferences)
    .set(input)
    .where(eq(userPreferences.userId, ctx.session.user.id))
}

export default updateUserPreference
