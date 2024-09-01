import { eq } from 'drizzle-orm'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import { userPayments } from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
}

export const findUserPaymentInfo = async ({ ctx }: Options) => {
  const userId = ctx.session.user.id

  const [userPayment] = await ctx.db
    .select({
      id: userPayments.id,
      customerId: userPayments.customerId,
      cardToken: userPayments.cardToken,
    })
    .from(userPayments)
    .where(eq(userPayments.userId, userId))

  return userPayment
}
