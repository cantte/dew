import { eq } from 'drizzle-orm'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import { users } from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
}

export const checkUserTrialIsActive = async ({ ctx }: Options) => {
  const userId = ctx.session.user.id

  const [dbUser] = await ctx.db
    .select({
      id: users.id,
      trialEnd: users.trialEnd,
    })
    .from(users)
    .where(eq(users.id, userId))

  if (!dbUser) {
    return false
  }

  if (dbUser.trialEnd === null) {
    await ctx.db
      .update(users)
      .set({
        // 14 days from now
        trialEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      })
      .where(eq(users.id, userId))

    return true
  }

  return dbUser.trialEnd > new Date()
}
