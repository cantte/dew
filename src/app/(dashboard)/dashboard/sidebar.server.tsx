import { Sidebar } from '~/components/layout/sidebar'
import { Skeleton } from '~/components/ui/skeleton'
import { api } from '~/trpc/server'

export const DashboardServerSidebar = async () => {
  const items = await api.menu.list()

  return (
    <div className="grid gap-1">
      <Sidebar items={items} />
    </div>
  )
}

export const DashboardServerSidebarFallback = () => {
  return (
    <div className="grid gap-1">
      <nav className="relative z-10 hidden h-screen w-[72px] flex-none border-r pt-20 duration-500 md:block">
        <div className="space-y-4 py-4">
          <div className="mt-3 px-3 py-2">
            <nav className="grid items-start gap-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </nav>
          </div>
        </div>
      </nav>
    </div>
  )
}
