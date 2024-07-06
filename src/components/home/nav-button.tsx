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
          <Button size="sm" asChild>
            <Link href="/dashboard">Ir al panel de control</Link>
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
