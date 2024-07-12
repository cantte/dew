import { LayoutDashboard } from 'lucide-react'
import Link from 'next/link'
import SignInButton from '~/components/signin-button'
import { Button } from '~/components/ui/button'
import { getServerAuthSession } from '~/server/auth'

export const NavButton = async () => {
  const session = await getServerAuthSession()

  return (
    <ul className="flex gap-2">
      {session !== null && (
        <li className="inline-flex items-center justify-center">
          <Button asChild size="sm" className="h-7 gap-1">
            <Link href="/dashboard">
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Panel de control
              </span>
            </Link>
          </Button>
        </li>
      )}

      {session === null && (
        <li className="inline-flex items-center justify-center">
          <SignInButton />
        </li>
      )}
    </ul>
  )
}
