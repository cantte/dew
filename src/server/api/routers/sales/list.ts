import { desc, eq } from 'drizzle-orm'
import type { TypeOf } from 'zod'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import type { byStoreInput } from '~/server/api/schemas/common'
import { sales } from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
  input: TypeOf<typeof byStoreInput>
}

const listSales = async ({ ctx, input }: Options) => {
  return await ctx.db.query.sales.findMany({
    with: {
      customer: {
        columns: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: [desc(sales.createdAt)],
    where: eq(sales.storeId, input.storeId),
  })
}

export default listSales
