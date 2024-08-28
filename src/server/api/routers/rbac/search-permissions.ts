import { and, eq, isNotNull } from 'drizzle-orm'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import {
    employeeStore,
    employees,
    permissions,
    rolePermission,
} from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
}

export const searchPermissions = async ({ ctx }: Options) => {
  const permissionsR = await ctx.db
    .select({
      name: permissions.name,
    })
    .from(permissions)
    .innerJoin(rolePermission, eq(rolePermission.permissionId, permissions.id))
    .innerJoin(employeeStore, eq(employeeStore.roleId, rolePermission.roleId))
    .innerJoin(employees, eq(employees.id, employeeStore.employeeId))
    .where(
      and(
        isNotNull(employeeStore.roleId),
        eq(employees.userId, ctx.session.user.id),
      ),
    )

  return permissionsR.map((permission) => permission.name)
}
