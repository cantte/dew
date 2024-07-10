import { and, eq, isNotNull } from 'drizzle-orm'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import findUserPreference from '~/server/api/routers/userPreferences/find'
import { stores } from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
}

const findCurrentStore = async ({ ctx }: Options) => {
  const userPreference = await findUserPreference(ctx)

  if (userPreference === undefined) {
    return undefined
  }

  return ctx.db.query.stores.findFirst({
    where: and(
      eq(stores.id, userPreference.storeId),
      isNotNull(stores.deletedAt),
    ),
  })
}

export default findCurrentStore
