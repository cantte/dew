import { eq, sql } from 'drizzle-orm'
import type { TypeOf } from 'zod'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import type { findStoreInput } from '~/server/api/schemas/stores'
import { stores } from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
  input: TypeOf<typeof findStoreInput>
}

export const deleteStore = async ({ ctx, input }: Options) => {
  return await ctx.db
    .update(stores)
    .set({
      deletedAt: sql`CURRENT_TIMESTAMP`,
    })
    .where(eq(stores.id, input.id))
}
