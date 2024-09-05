import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div>
          <div className="py-8 lg:py-16 lg:pe-16">
            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div>
                <p className="font-medium ">Dew</p>

                <ul className="mt-6 space-y-4 text-sm">
                  <li>
                    <Link href="/features" className="text-muted-foreground">
                      Características
                    </Link>
                  </li>
                  <li>
                    <Link href="/pricing" className="text-muted-foreground">
                      Precios
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" className="text-muted-foreground">
                      Preguntas frecuentes
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 border-t pt-8">
              <ul className="flex flex-wrap gap-4 text-xs">
                <li>
                  <Link href="/privacy" className="text-muted-foreground">
                    Política de privacidad
                  </Link>
                </li>
              </ul>

              <p className="mt-8 text-xs ">
                &copy; {new Date().getFullYear()}. Dew. Todos los derechos
                reservados.
              </p>

              <p className="mt-4 text-xs">
                Hecho con ❤️ por{' '}
                <Link
                  href="https://www.cantte.com/"
                  target="_blank"
                  className="text-muted-foreground"
                >
                  cantte
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
