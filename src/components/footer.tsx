import Link from 'next/link'
import { ThemeToggle } from '~/components/theme-toggle'

const Footer = () => {
  return (
    <footer className="flex items-center justify-center border-t py-4">
      <div className="flex w-full max-w-7xl items-center justify-between">
        <div className="flex flex-col items-center">
          <span className="inline-flex items-center gap-2 font-normal text-muted-foreground text-sm">
            {new Date().getFullYear()} © dew
          </span>
          <span className="inline-flex items-center gap-2 font-normal text-muted-foreground text-sm">
            Creado con <span className="text-red-500">❤</span> por
            <Link
              href="https://www.cantte.com/"
              target="_blank"
              className="text-foreground transition-colors duration-200 hover:text-foreground/80"
            >
              cantte
            </Link>
          </span>
        </div>

        <div>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  )
}

export default Footer
