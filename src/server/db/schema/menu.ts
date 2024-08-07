import { relations } from 'drizzle-orm'
import {
  type AnyPgColumn,
  boolean,
  index,
  integer,
  primaryKey,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import { createTable } from '~/server/db/schema/base'
import { roles } from '~/server/db/schema/rbac'

export const menuItems = createTable(
  'menu_item',
  {
    id: uuid('id').notNull().primaryKey(),
    parentId: uuid('parent_id').references((): AnyPgColumn => menuItems.id),
    title: varchar('title', { length: 255 }).notNull(),
    href: varchar('href', { length: 255 }),
    icon: varchar('icon', { length: 30 }),
    priority: integer('priority').notNull().default(0),
    enabled: boolean('enabled').notNull().default(true),
  },
  (menu) => ({
    parentIdIdx: index('menu_item_parent_id_idx').on(menu.parentId),
  }),
)

export const menuRelations = relations(menuItems, ({ one }) => ({
  parent: one(menuItems, {
    fields: [menuItems.parentId],
    references: [menuItems.id],
  }),
}))

export const roleMenuItems = createTable(
  'role_menu_item',
  {
    roleId: uuid('role_id')
      .notNull()
      .references(() => roles.id),
    menuItemId: uuid('menu_item_id')
      .notNull()
      .references(() => menuItems.id),
  },
  (roleMenuItem) => ({
    roleIdIdx: index('role_menu_item_role_id_idx').on(roleMenuItem.roleId),
    menuItemIdIdx: index('role_menu_item_menu_item_id_idx').on(
      roleMenuItem.menuItemId,
    ),
    compoundKey: primaryKey({
      columns: [roleMenuItem.roleId, roleMenuItem.menuItemId],
    }),
  }),
)
