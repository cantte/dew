import Link from 'next/link'
import { MainMenuIcon } from '~/components/dashboard/main-menu-icon'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from '~/components/ui/sidebar'
import { api } from '~/trpc/server'

export const DashboardMainMenu = async () => {
  const items = await api.menu.list()

  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.id}>
          <SidebarMenuButton asChild tooltip={item.title}>
            {item.href ? (
              <Link href={item.href}>
                {item.icon && <MainMenuIcon icon={item.icon} />}
                <span>{item.title}</span>
              </Link>
            ) : (
              <>
                <span>{item.title}</span>
              </>
            )}
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}

export const DashboardMainMenuFallback = () => {
  return (
    <SidebarMenu>
      {Array.from({ length: 5 }).map((_, index) => (
        <SidebarMenuItem key={index}>
          <SidebarMenuSkeleton showIcon />
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
