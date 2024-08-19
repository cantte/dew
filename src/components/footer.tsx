import Link from 'next/link'
import { ThemeToggle } from '~/components/theme-toggle'

const Footer = () => {
  return (
    <footer className="flex items-center justify-center border-t py-4">
      <div className="flex w-full max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-col space-y-1.5">
          <p className="font-semibold">dew</p>

          <Link href="/pricing" className="text-muted-foreground text-sm">
            Precios
          </Link>

          <Link href="/features" className="text-muted-foreground text-sm">
            Características
          </Link>

          <Link href="/terms" className="text-muted-foreground text-sm">
            Condiciones de uso
          </Link>

          <Link href="/privacy" className="text-muted-foreground text-sm">
            Política de privacidad
          </Link>

          <Link href="/faq" className="text-muted-foreground text-sm">
            Preguntas frecuentes
          </Link>
        </div>

        <div className="flex flex-col items-center space-y-1">
          <div>
            <ThemeToggle />
          </div>

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
      </div>
    </footer>
  )
}

export default Footer
