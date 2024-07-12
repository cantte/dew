'use client'

import { LogIn } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { Button } from '~/components/ui/button'

const SignInButton = () => {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl')

  return (
    <Button
      size="sm"
      className="h-7 gap-1"
      onClick={() =>
        void signIn('google', {
          callbackUrl: callbackUrl ?? '/dashboard',
        })
      }
    >
      <LogIn className="h-3.5 w-3.5" />
      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
        Iniciar sesión
      </span>
    </Button>
  )
}

export default SignInButton
