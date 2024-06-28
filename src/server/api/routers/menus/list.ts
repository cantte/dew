import { and, desc, eq } from 'drizzle-orm'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import findCurrentStore from '~/server/api/routers/stores/findCurrent'
import {
    employeeStore,
    employees,
    menuItems,
    roleMenuItems,
} from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
}

export const listUserMenus = async ({ ctx }: Options) => {
  const store = await findCurrentStore({ ctx })

  if (!store) {
    return []
  }

  const role = await ctx.db
    .select({
      id: employeeStore.roleId,
    })
    .from(employeeStore)
    .innerJoin(employees, eq(employees.id, employeeStore.employeeId))
    .where(
      and(
        eq(employees.userId, ctx.session.user.id),
        eq(employeeStore.storeId, store.id),
      ),
    )
    .limit(1)

  if (!role.length) {
    return []
  }

  const roleId = role[0]?.id

  if (!roleId) {
    return []
  }

  return await ctx.db
    .select({
      id: menuItems.id,
      parentId: menuItems.parentId,
      title: menuItems.title,
      href: menuItems.href,
      icon: menuItems.icon,
    })
    .from(roleMenuItems)
    .innerJoin(menuItems, eq(menuItems.id, roleMenuItems.menuItemId))
    .where(eq(roleMenuItems.roleId, roleId))
    .orderBy(desc(menuItems.priority))
}
