import DashboardClientSidebar from '~/app/(dashboard)/dashboard/sidebar.client'
import { Skeleton } from '~/components/ui/skeleton'
import { api } from '~/trpc/server'

export const DashboardServerSidebar = async () => {
  const items = await api.menu.list()

  return (
    <div className="grid gap-1">
      <DashboardClientSidebar items={items} />
    </div>
  )
}

export const DashboardServerSidebarFallback = () => {
  return (
    <div className="grid gap-1">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
    </div>
  )
}
