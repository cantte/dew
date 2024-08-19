'use client'

import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { GoogleIcon } from '~/components/icons/google'
import { Button } from '~/components/ui/button'

export const GoogleSignInButton = () => {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl')

  return (
    <Button
      variant="outline"
      onClick={() =>
        void signIn('google', {
          callbackUrl: callbackUrl ?? '/dashboard',
        })
      }
    >
      <GoogleIcon className="h-5 w-5 sm:mr-2" />
      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
        Iniciar sesión con Google
      </span>
    </Button>
  )
}
