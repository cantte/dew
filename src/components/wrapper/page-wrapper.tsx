import type { ReactNode } from 'react'
import Footer from '~/components/footer'
import { MainNav } from '~/components/main-nav'

type Props = {
  children: ReactNode
}

export const PageWrapper = ({ children }: Readonly<Props>) => {
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <MainNav />
      </header>

      <main className="flex min-h-screen min-w-screen flex-col items-center justify-between">
        {children}
      </main>

      <Footer />
    </>
  )
}
