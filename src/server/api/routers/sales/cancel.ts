import { eq } from 'drizzle-orm'
import type { TypeOf } from 'zod'
import type { findSaleInput } from '~/server/api/schemas/sales'
import type { TRPCContextInner } from '~/server/api/trpc'
import { sales } from '~/server/db/schema'

type Options = {
  ctx: TRPCContextInner
  input: TypeOf<typeof findSaleInput>
}

export const cancelSale = async ({ ctx, input }: Options) => {
  return await ctx.db
    .update(sales)
    .set({
      status: 'cancelled',
    })
    .where(eq(sales.code, input.code))
}
