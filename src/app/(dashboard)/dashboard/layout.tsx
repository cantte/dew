import Link from 'next/link'
import { redirect } from 'next/navigation'
import { type ReactNode, Suspense } from 'react'
import CreateSaleButton from '~/app/(dashboard)/dashboard/sales/create-button'
import {
  DashboardServerSidebar,
  DashboardServerSidebarFallback,
} from '~/app/(dashboard)/dashboard/sidebar.server'
import AccountNav from '~/components/account-nav'
import MobileNav from '~/components/mobile-nav'
import { SentryFeedbackWidget } from '~/components/sentry-feedback-widget'
import SelectStore from '~/components/stores/select-store'
import { Badge } from '~/components/ui/badge'
import { ScrollArea } from '~/components/ui/scroll-area'
import { Separator } from '~/components/ui/separator'
import { Skeleton } from '~/components/ui/skeleton'
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

  const currentStore = await api.store.findCurrent()
  const stores = await api.store.list()

  const canCreateStore = await api.rbac.checkPermissions({
    permissions: ['store:create'],
  })

  return (
    <div className="grid min-h-screen w-full overflow-hidden md:grid-cols-[280px_1fr]">
      <div className="hidden border-r md:block">
        <div className="flex flex-col gap-2">
          <div className="flex h-[60px] items-center px-6">
            <Link className="flex items-center gap-3" href="/">
              <span className="font-semibold text-lg">dew</span>
              <Badge>beta</Badge>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-4 font-medium text-sm">
              <ScrollArea>
                <Suspense fallback={<DashboardServerSidebarFallback />}>
                  <DashboardServerSidebar />
                </Suspense>
              </ScrollArea>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center justify-between gap-4 border-b px-6 lg:h-[60px]">
          <div className="flex items-center gap-3">
            <MobileNav />

            <SelectStore
              currentStore={currentStore}
              stores={stores}
              canCreateStore={canCreateStore}
            />
          </div>

          <nav className="flex items-center gap-3">
            <ul className="flex gap-2">
              <li className="flex items-center">
                <Suspense fallback={<Skeleton className="h-8 w-32" />}>
                  <CreateSaleButton />
                </Suspense>
              </li>

              <li>
                <Separator orientation="vertical" />
              </li>

              <li className="inline-flex items-center justify-center">
                <AccountNav user={session.user} />
              </li>
            </ul>
          </nav>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          {children}
        </main>
      </div>

      <SentryFeedbackWidget />
    </div>
  )
}

export default DashboardLayout
