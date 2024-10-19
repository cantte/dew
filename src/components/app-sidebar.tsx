import { Suspense } from 'react'
import { AccountNav, AccountNavFallback } from '~/components/account-nav'
import {
  DashboardMainMenu,
  DashboardMainMenuFallback,
} from '~/components/dashboard/main-menu'
import { SelectStore } from '~/components/dashboard/select-store'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarRail,
} from '~/components/ui/sidebar'

export const AppSidebar = () => {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SelectStore />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <Suspense fallback={<DashboardMainMenuFallback />}>
            <DashboardMainMenu />
          </Suspense>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Suspense fallback={<AccountNavFallback />}>
          <AccountNav />
        </Suspense>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
