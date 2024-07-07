import Link from 'next/link'
import Footer from '~/components/footer'
import { ThemeToggle } from '~/components/theme-toggle'
import { Badge } from '~/components/ui/badge'

type Props = {
  children: React.ReactNode
}

const DefaultLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen w-full overflow-hidden">
      <div className="flex min-h-screen flex-col">
        <header className="flex h-14 items-center justify-between gap-4 border-b px-6 lg:h-[60px]">
          <Link className="flex items-center gap-3" href="/">
            <span className='font-semibold text-lg'>dew</span>
            <Badge>beta</Badge>
          </Link>

          <nav className="flex items-center gap-3">
            <ul className="flex gap-2">
              <li>
                <ThemeToggle />
              </li>
            </ul>
          </nav>
        </header>

        <main className="flex grow flex-col items-center gap-4 p-4 md:gap-8 md:p-6">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default DefaultLayout
