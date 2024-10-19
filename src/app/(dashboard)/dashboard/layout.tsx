import { redirect } from 'next/navigation'
import type { ReactNode } from 'react'
import { AppSidebar } from '~/components/app-sidebar'
import { SetPermissions } from '~/components/set-permissions'
import { Badge } from '~/components/ui/badge'
import { Separator } from '~/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '~/components/ui/sidebar'
import { getServerAuthSession } from '~/server/auth'
import { api } from '~/trpc/server'

type Props = {
  children: ReactNode
}

const DashboardLayout = async ({ children }: Props) => {
  const session = await getServerAuthSession()

  if (!session) {
    return redirect('/api/auth/signin')
  }

  const permissions = await api.rbac.list()

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 bg-background/95 backdrop-blur transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />

            <Separator orientation="vertical" className="mr-2 h-4" />

            <Badge>beta</Badge>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <SetPermissions permissions={permissions} />

          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default DashboardLayout
