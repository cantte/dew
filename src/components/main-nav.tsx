import Link from 'next/link'
import { Suspense } from 'react'
import { NavButton } from '~/components/home/nav-button'
import { Badge } from '~/components/ui/badge'

export const MainNav = () => {
  return (
    <div className="flex h-14 items-center justify-end gap-4 border-b px-4 md:justify-between">
      <div className="hidden gap-4 md:flex">
        <Link href="/" className="mr-4 flex items-center gap-2">
          <span className="font-semibold text-lg">dew</span>
          <Badge>beta</Badge>
        </Link>

        <nav className="flex items-center gap-4 text-sm lg:gap-6">
          <Link
            href="/features"
            className="transition-colors hover:text-foreground/80"
          >
            Características
          </Link>

          <Link
            href="/pricing"
            className="transition-colors hover:text-foreground/80"
          >
            Precios
          </Link>

          <Link
            href="/faq"
            className="transition-colors hover:text-foreground/80"
          >
            FAQ
          </Link>
        </nav>
      </div>

      <nav className="flex items-center gap-3">
        <Suspense fallback={null}>
          <NavButton />
        </Suspense>
      </nav>
    </div>
  )
}
