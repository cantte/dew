import { and, eq, isNull } from 'drizzle-orm'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import findUserPreference from '~/server/api/routers/userPreferences/find'
import { stores } from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
}

export const findCurrentStore = async ({ ctx }: Options) => {
  const userPreference = await findUserPreference(ctx)

  if (userPreference === undefined) {
    return undefined
  }

  const [store] = await ctx.db
    .select({
      id: stores.id,
      name: stores.name,
      address: stores.address,
      phone: stores.phone,
      nit: stores.nit,
      createdBy: stores.createdBy,
    })
    .from(stores)
    .where(and(eq(stores.id, userPreference.storeId), isNull(stores.deletedAt)))
    .limit(1)

  return store
}
