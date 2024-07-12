import { ArrowRightIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { Suspense } from 'react'
import Footer from '~/components/footer'
import FeaturesSection from '~/components/home/features'
import { NavButton } from '~/components/home/nav-button'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'

export default function Home() {
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between gap-4 border-b px-4">
          <div className="flex gap-4">
            <div className="mr-4 flex items-center gap-2">
              <span className="font-semibold text-lg">dew</span>
              <Badge>beta</Badge>
            </div>

            <div className="hidden items-center gap-4 text-xs md:flex">
              <Button
                asChild
                size="sm"
                className="h-7 gap-1 font-light"
                variant="ghost"
              >
                <Link
                  href="#features"
                  className="text-foreground/60 transition-colors hover:text-foreground/80"
                >
                  Características
                </Link>
              </Button>

              <Button
                size="sm"
                className="h-7 gap-2 font-light"
                variant="ghost"
                disabled={true}
              >
                <span className="text-foreground/60">Precios</span>

                <Badge className="font-light">Próximamente</Badge>
              </Button>
            </div>
          </div>

          <nav className="flex items-center gap-3">
            <Suspense fallback={null}>
              <NavButton />
            </Suspense>
          </nav>
        </div>
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
                <span className="font-normal text-[17px] text-muted-foreground tracking-[-0.16px] md:text-xl">
                  Evita el papeleo y lleva el control de tus ventas de manera
                  eficiente.
                </span>
              </div>
            </div>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  Empezar ahora <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button size="lg" variant="outline" asChild>
                <Link href="#features">Saber más</Link>
              </Button>
            </div>
          </div>
        </section>

        <FeaturesSection />
      </main>

      <Footer />
    </>
  )
}
