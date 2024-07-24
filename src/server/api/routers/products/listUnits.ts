import { isNull } from 'drizzle-orm'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import { units } from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
}

export const listProductUnits = async ({ ctx }: Options) => {
  return await ctx.db
    .select({
      id: units.id,
      name: units.name,
    })
    .from(units)
    .where(isNull(units.deletedAt))
}
