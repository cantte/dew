import { differenceInDays } from 'date-fns'
import { eq } from 'drizzle-orm'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import { users } from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
}

export const findUserTrial = async ({ ctx }: Options) => {
  const userId = ctx.session.user.id

  const [dbUser] = await ctx.db
    .select({
      id: users.id,
      trialEnd: users.trialEnd,
    })
    .from(users)
    .where(eq(users.id, userId))

  if (!dbUser) {
    return {
      remainingDays: 0,
      isActive: false,
    }
  }

  if (!dbUser.trialEnd) {
    await ctx.db
      .update(users)
      .set({
        // 14 days from now
        trialEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      })
      .where(eq(users.id, userId))

    return {
      remainingDays: 14,
      isActive: true,
    }
  }

  const today = new Date()
  const remainingDays = differenceInDays(dbUser.trialEnd, today)

  return {
    remainingDays,
    isActive: dbUser.trialEnd > today,
  }
}
