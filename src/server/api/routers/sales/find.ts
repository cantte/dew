import { eq } from 'drizzle-orm'
import type { TypeOf } from 'zod'
import type { findSaleInput } from '~/server/api/schemas/sales'
import type { TRPCContextInner } from '~/server/api/trpc'
import { sales } from '~/server/db/schema'

type Options = {
  ctx: TRPCContextInner
  input: TypeOf<typeof findSaleInput>
}

const findSale = async ({ ctx, input }: Options) => {
  return await ctx.db.query.sales.findFirst({
    with: {
      customer: {
        columns: {
          id: true,
          name: true,
          phone: true,
          email: true,
        },
      },
      saleItems: {
        with: {
          product: {
            columns: {
              code: true,
              name: true,
            },
          },
        },
      },
      store: {
        columns: {
          name: true,
          nit: true,
        },
      },
      employee: {
        columns: {
          code: true,
          name: true,
        },
      },
    },
    where: eq(sales.code, input.code),
  })
}

export default findSale
