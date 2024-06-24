import { ArrowRightIcon } from '@radix-ui/react-icons'
import NextLink from 'next/link'
import Footer from '~/components/footer'
import FeaturesSection from '~/components/home/features'
import SignInButton from '~/components/signin-button'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { getServerAuthSession } from '~/server/auth'

export default async function Home() {
  const session = await getServerAuthSession()

  return (
    <div className="min-h-screen w-full overflow-hidden">
      <div className="flex flex-col">
        <header className="flex h-14 items-center justify-between gap-4 border-b px-6 lg:h-[60px]">
          <div className="flex items-center gap-3">
            <span className='font-semibold text-lg'>dew</span>
            <Badge>beta</Badge>
          </div>

          <nav className="flex items-center gap-3">
            <ul className="flex gap-2">
              {session !== null && (
                <li className="inline-flex items-center justify-center">
                  <Button size="sm" asChild>
                    <NextLink href="/dashboard">
                      Ir al panel de control
                    </NextLink>
                  </Button>
                </li>
              )}

              {session === null && (
                <li className="inline-flex items-center justify-center">
                  <SignInButton />
                </li>
              )}
            </ul>
          </nav>
        </header>

        <main className="flex flex-1 flex-col items-center gap-4 p-4 md:gap-8 md:p-6">
          <section className="relative flex h-[calc(100vh-80px)] max-w-3xl flex-col justify-center md:mx-auto md:h-[calc(100vh-100px)]">
            <div className="flex grow flex-col justify-center">
              <div className="max-w-[725px] text-center">
                <h1 className="mb-8 text-[38px] leading-[46px] md:text-[70px] md:leading-[85px]">
                  <span>Lleva un registro de tus</span>{' '}
                  <span className="text-primary-text">ventas</span>{' '}
                  <span>sin complicaciones</span>
                </h1>
                <div className="text-center sm:px-20">
                  <span className='font-normal text-[17px] text-muted-foreground tracking-[-0.16px] md:text-xl'>
                    Evita el papeleo y lleva el control de tus ventas de manera
                    eficiente.
                  </span>
                </div>
              </div>
              <div className="mt-10 flex items-center justify-center gap-4">
                <Button size="lg" asChild>
                  <NextLink href="/dashboard">
                    Empezar ahora <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </NextLink>
                </Button>

                <Button size="lg" variant="outline" asChild>
                  <NextLink href="#features">Saber más</NextLink>
                </Button>
              </div>
            </div>
          </section>

          <FeaturesSection />
        </main>

        <Footer />
      </div>
    </div>
  )
}
