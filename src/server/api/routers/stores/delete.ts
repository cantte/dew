import { and, desc, eq, isNull, sql } from 'drizzle-orm'
import type { TypeOf } from 'zod'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import type { findStoreInput } from '~/server/api/schemas/stores'
import { stores, userPreferences } from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
  input: TypeOf<typeof findStoreInput>
}

export const deleteStore = async ({ ctx, input }: Options) => {
  const deleteStoreResult = await ctx.db
    .update(stores)
    .set({
      deletedAt: sql`CURRENT_TIMESTAMP`,
    })
    .where(eq(stores.id, input.id))

  if (deleteStoreResult.count === 0) {
    throw new Error(`[ERROR]: Cannot delete store with id ${input.id}`)
  }

  const [lastStore] = await ctx.db
    .select({
      id: stores.id,
    })
    .from(stores)
    .where(
      and(eq(stores.createdBy, ctx.session.user.id), isNull(stores.deletedAt)),
    )
    .orderBy(desc(stores.createdAt))
    .limit(1)

  await ctx.db
    .update(userPreferences)
    .set({
      storeId: lastStore?.id ?? sql`NULL`,
    })
    .where(eq(userPreferences.userId, ctx.session.user.id))

  return true
}
