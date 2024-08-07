import Link from 'next/link'
import { Suspense } from 'react'
import AccountNav from '~/components/account-nav'
import {
  MobileNavServer,
  MobileNavServerFallback,
} from '~/components/mobile-nav.server'
import { Badge } from '~/components/ui/badge'
import { getServerAuthSession } from '~/server/auth'

export const Header = async () => {
  const session = await getServerAuthSession()

  if (!session) {
    return null
  }

  return (
    <div className="fixed top-0 right-0 left-0 z-20 border-b bg-background/95 backdrop-blur supports-backdrop-blur:bg-background/60">
      <nav className="flex h-14 items-center justify-between px-4">
        <div className="hidden lg:block">
          <Link className="mr-4 flex items-center gap-2" href="/">
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
          <li className="inline-flex items-center justify-center">
            <AccountNav user={session.user} />
          </li>
        </ul>
      </nav>
    </div>
  )
}
