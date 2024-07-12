'use client'

import type { ReactNode } from 'react'
import BackButton from '~/components/back-button'
import Footer from '~/components/footer'
import { Badge } from '~/components/ui/badge'

type Props = {
  title: string
  children: ReactNode
}

const MainShell = ({ title, children }: Props) => {
  return (
    <main className="relative z-20 mx-auto flex h-screen h-screen-ios max-w-7xl flex-col justify-between overflow-x-hidden px-4">
      <header className="flex h-[80px] items-center justify-between md:h-[100px]">
        <div className="mr-4 flex items-center gap-2">
          <span className="font-semibold text-lg">dew</span>
          <Badge>beta</Badge>
        </div>
      </header>

      <section className="mb-4">
        <div className="mt-4 mb-4 md:mt-0">
          <BackButton />
        </div>

        <section className="flex flex-col gap-4">
          <h1 className="font-bold text-2xl">{title}</h1>

          {children}
        </section>
      </section>

      <Footer />
    </main>
  )
}

export default MainShell
