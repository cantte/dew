import { eq } from 'drizzle-orm'
import type { TypeOf } from 'zod'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import type { findStoreInput } from '~/server/api/schemas/stores'
import { stores } from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
  input: TypeOf<typeof findStoreInput>
}

const findStore = async ({ ctx, input }: Options) => {
  return await ctx.db.query.stores.findFirst({
    where: eq(stores.id, input.id),
  })
}

export default findStore
