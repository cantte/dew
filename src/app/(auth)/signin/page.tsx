import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { GoogleSignInButton } from '~/components/auth/google-signin'
import DefaultLayout from '~/components/default-layout'
import { authOptions } from '~/server/auth'

export const metadata = {
  title: 'dew | iniciar sesión',
  description: 'software de facturación',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

const SignInPage = async () => {
  const session = await getServerSession(authOptions)
  if (session) {
    return redirect('/')
  }

  return (
    <DefaultLayout>
      <div className="grid h-[calc(100vh-15rem)] w-full max-w-7xl grid-cols-1 md:grid-cols-2">
        <div className="hidden md:flex">
          <div className="flex h-full flex-col items-center justify-center space-y-8">
            <h1 className="font-semibold text-4xl tracking-tight">
              Bienvenido a dew
            </h1>

            <p className="text-base text-muted-foreground">
              El software de facturación más sencillo y fácil de usar.
            </p>
          </div>
        </div>

        <div className="flex h-full flex-col items-center justify-center space-y-6 rounded border">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="font-semibold text-2xl tracking-tight">
              Iniciar sesión
            </h1>

            <p className="px-8 text-muted-foreground text-sm">
              Puedes acceder a nuestros servicios con tu cuenta de Google.
            </p>
          </div>

          <div className="grid gap-6">
            <GoogleSignInButton />
          </div>

          <p className="px-8 text-center text-muted-foreground text-sm">
            Al iniciar sesión, aceptas nuestra{' '}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Política de privacidad
            </Link>
            .
          </p>
        </div>
      </div>
    </DefaultLayout>
  )
}

export default SignInPage
