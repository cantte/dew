import { eq } from 'drizzle-orm'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import { employeeStore, employees, stores } from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
}

const listStores = async ({ ctx }: Options) => {
  return await ctx.db
    .select({
      id: stores.id,
      name: stores.name,
      address: stores.address,
      phone: stores.phone,
      createdAt: stores.createdAt,
    })
    .from(employeeStore)
    .innerJoin(stores, eq(employeeStore.storeId, stores.id))
    .innerJoin(employees, eq(employeeStore.employeeId, employees.id))
    .where(eq(employees.userId, ctx.session.user.id))
}

export default listStores
