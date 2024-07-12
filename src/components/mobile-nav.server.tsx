import { MobileNavClient } from '~/components/mobile-nav.client'
import { Skeleton } from '~/components/ui/skeleton'
import { api } from '~/trpc/server'

export const MobileNavServer = async () => {
  const items = await api.menu.list()

  return <MobileNavClient items={items} />
}

export const MobileNavServerFallback = () => {
  return <Skeleton className="h-5 w-5" />
}
