'use client'

import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { GoogleIcon } from '~/components/icons/google'
import { Button } from '~/components/ui/button'

export const GoogleSignInButton = () => {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl')

  const handleClick = async () => {
    await signIn('google', {
      callbackUrl: callbackUrl ?? '/dashboard',
    })
  }

  return (
    <Button variant="outline" onClick={handleClick}>
      <GoogleIcon className="mr-2 h-5 w-5" />
      <span className="whitespace-nowrap">Iniciar sesión con Google</span>
    </Button>
  )
}
