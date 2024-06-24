import type { TypeOf } from 'zod'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import type { createCustomerInput } from '~/server/api/schemas/customers'
import { customers } from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
  input: TypeOf<typeof createCustomerInput>
}

const createCustomer = async ({ ctx, input }: Options) => {
  await ctx.db.insert(customers).values({
    ...input,
    createdBy: ctx.session.user.id,
  })
}

export default createCustomer
