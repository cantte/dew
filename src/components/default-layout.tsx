import Link from 'next/link'
import Footer from '~/components/footer'
import { Badge } from '~/components/ui/badge'

type Props = {
  children: React.ReactNode
}

const DefaultLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen w-full overflow-hidden">
      <div className="flex min-h-screen flex-col">
        <header className="flex h-14 items-center justify-between gap-4 border-b px-6">
          <Link className="mr-4 flex items-center gap-2" href="/">
            <span className="font-semibold text-lg">dew</span>
            <Badge>beta</Badge>
          </Link>
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
