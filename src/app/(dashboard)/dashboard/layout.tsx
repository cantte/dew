import { redirect } from 'next/navigation'
import { type ReactNode, Suspense } from 'react'
import {
  DashboardServerSidebar,
  DashboardServerSidebarFallback,
} from '~/app/(dashboard)/dashboard/sidebar.server'
import { Header } from '~/components/layout/header'
import { SentryFeedbackWidget } from '~/components/sentry-feedback-widget'
import { SetPermissions } from '~/components/set-permissions'
import { ScrollArea } from '~/components/ui/scroll-area'
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
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Suspense fallback={<DashboardServerSidebarFallback />}>
          <DashboardServerSidebar />
        </Suspense>
        <main className="flex-1 overflow-hidden pt-16">
          <ScrollArea className="h-full">
            <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">{children}</div>
          </ScrollArea>
        </main>

        <SetPermissions permissions={permissions} />

        <SentryFeedbackWidget />
      </div>
    </>
  )
}

export default DashboardLayout
