import Link from 'next/link'
import { Suspense } from 'react'
import AccountNav from '~/components/account-nav'
import {
  MobileNavServer,
  MobileNavServerFallback,
} from '~/components/mobile-nav.server'
import SelectStore from '~/components/stores/select-store'
import { Badge } from '~/components/ui/badge'
import { Separator } from '~/components/ui/separator'
import { getServerAuthSession } from '~/server/auth'
import { api } from '~/trpc/server'

export const Header = async () => {
  const session = await getServerAuthSession()

  if (!session) {
    return null
  }

  const currentStore = await api.store.findCurrent()
  const stores = await api.store.list()

  const canCreateStore = await api.rbac.checkPermissions({
    permissions: ['store:create'],
  })

  return (
    <div className="fixed top-0 right-0 left-0 z-20 border-b bg-background/95 backdrop-blur supports-backdrop-blur:bg-background/60">
      <nav className="flex h-14 items-center justify-between px-4">
        <div className="hidden lg:block">
          <Link className="flex items-center gap-3" href="/">
            <span className="font-semibold text-lg">dew</span>
            <Badge>beta</Badge>
          </Link>
        </div>

        <div className="lg:!hidden block">
          <Suspense fallback={<MobileNavServerFallback />}>
            <MobileNavServer />
          </Suspense>
        </div>

        <ul className="flex gap-2">
          <li className="flex items-center">
            <SelectStore
              currentStore={currentStore}
              stores={stores}
              canCreateStore={canCreateStore}
            />
          </li>

          <li>
            <Separator orientation="vertical" />
          </li>

          <li className="inline-flex items-center justify-center">
            <AccountNav user={session.user} />
          </li>
        </ul>
      </nav>
    </div>
  )
}
