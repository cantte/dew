'use client'

import { LogIn } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Button } from '~/components/ui/button'

const SignInButton = () => {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard'

  return (
    <Button asChild>
      <Link
        href={`/api/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`}
      >
        <LogIn className="h-3.5 w-3.5 sm:mr-2" />
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
          Iniciar sesión
        </span>
      </Link>
    </Button>
  )
}

export default SignInButton
