import { eq } from 'drizzle-orm'
import type { TypeOf } from 'zod'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import type { updateStoreInput } from '~/server/api/schemas/stores'
import { stores } from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
  input: TypeOf<typeof updateStoreInput>
}

const updateStore = async ({ ctx, input }: Options) => {
  await ctx.db.update(stores).set(input).where(eq(stores.id, input.id))
}

export default updateStore
