import { eq } from 'drizzle-orm'
import type { TypeOf } from 'zod'
import uuid from '~/lib/uuid'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import { findEmployeeById } from '~/server/api/routers/employees/find-by-id'
import type { createStoreInput } from '~/server/api/schemas/stores'
import {
  cashRegisters,
  employeeStore,
  employees,
  roles,
  stores,
  userPreferences,
} from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
  input: TypeOf<typeof createStoreInput>
}

const createStore = async ({ ctx, input }: Options) => {
  await ctx.db.transaction(async (tx) => {
    const adminRole = await tx.query.roles.findFirst({
      columns: {
        id: true,
      },
      where: eq(roles.name, 'admin'),
    })

    if (!adminRole) {
      throw new Error('Admin role not found')
    }

    const storeId = uuid()
    await tx.insert(stores).values({
      ...input,
      id: storeId,
      createdBy: ctx.session.user.id,
    })

    await tx
      .insert(userPreferences)
      .values({
        userId: ctx.session.user.id,
        storeId: storeId,
      })
      .onConflictDoUpdate({
        target: userPreferences.userId,
        set: {
          storeId,
        },
      })

    const user = ctx.session.user
    const employee = await findEmployeeById({ ctx, input: { code: user.id } })

    if (!employee) {
      await tx
        .insert(employees)
        .values({
          id: user.id,
          name: user.name ?? 'Sin nombre',
          email: user.email ?? 'Sin email',
          userId: user.id,
          createdBy: user.id,
        })
        .onConflictDoNothing()
    }

    await tx.insert(employeeStore).values({
      employeeId: employee?.id ?? user.id,
      storeId: storeId,
      roleId: adminRole.id,
    })

    await tx.insert(cashRegisters).values({
      id: uuid(),
      storeId,
      amount: 0,
      createdBy: ctx.session.user.id,
    })
  })
}

export default createStore
