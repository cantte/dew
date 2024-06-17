import { and, eq, inArray, isNotNull } from "drizzle-orm";
import type { TypeOf } from "zod";
import type { TRPCAuthedContext } from "~/server/api/procedures/authed";
import type { checkPermissionsInput } from "~/server/api/schemas/rbac";
import {
  employeeStoreRole,
  employees,
  permission,
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
      hasPermissions: isNotNull(employeeStoreRole.employeeId),
    })
    .from(employeeStoreRole)
    .innerJoin(employees, eq(employees.id, employeeStoreRole.employeeId))
    .innerJoin(
      rolePermission,
      eq(rolePermission.roleId, employeeStoreRole.roleId),
    )
    .innerJoin(
      permission,
      and(
        eq(permission.id, rolePermission.permissionId),
        inArray(permission.name, grants),
      ),
    )
    .where(eq(employees.userId, ctx.session.user.id));

  return hasPermissions.length > 0;
};

export default checkPermissions;
