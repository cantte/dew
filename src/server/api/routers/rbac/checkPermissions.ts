import { and, eq, inArray, isNotNull } from "drizzle-orm";
import type { TypeOf } from "zod";
import type { TRPCAuthedContext } from "~/server/api/procedures/authed";
import type { checkPermissionsInput } from "~/server/api/schemas/rbac";
import {
  employeeStore,
  employees,
  permissions,
  rolePermission,
} from "~/server/db/schema";

type Options = {
  ctx: TRPCAuthedContext;
  input: TypeOf<typeof checkPermissionsInput>;
};

const checkPermissions = async ({ ctx, input }: Options) => {
  const grants = input.permissions;

  const hasPermissions = await ctx.db
    .select({
      hasPermissions: isNotNull(employeeStore.employeeId),
    })
    .from(employeeStore)
    .innerJoin(employees, eq(employees.id, employeeStore.employeeId))
    .innerJoin(rolePermission, eq(rolePermission.roleId, employeeStore.roleId))
    .innerJoin(
      permissions,
      and(
        eq(permissions.id, rolePermission.permissionId),
        inArray(permissions.name, grants),
      ),
    )
    .where(
      and(
        isNotNull(employeeStore.roleId),
        eq(employees.userId, ctx.session.user.id),
      ),
    );

  return hasPermissions.length > 0;
};

export default checkPermissions;
