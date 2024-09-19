import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '~/components/ui/button'

export const HeroSection = () => {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="sm:text-center md:mx-auto md:max-w-2xl lg:col-span-6 lg:text-left">
            <h1 className="font-bold text-4xl tracking-tight sm:text-5xl md:text-6xl">
              Simplifique sus ventas
              <span className="block text-primary-text">
                amplifique sus resultados
              </span>
            </h1>

            <p className="mt-3 text-base text-muted-foreground sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
              Dew es el sistema de punto de venta intuitivo que transforma la
              complejidad en claridad. Gestione sus ventas con facilidad y
              obtenga insights profundos para hacer crecer su negocio.
            </p>

            <div className="mt-8 sm:mx-auto sm:max-w-lg sm:text-center lg:mx-0 lg:text-left">
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  Comenzar ahora
                  <ArrowRight className="ml-2 size-5" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative mt-12 sm:mx-auto sm:max-w-lg lg:col-span-6 lg:mx-0 lg:mt-0 lg:flex lg:max-w-none lg:items-center">
            <div className="relative mt-7 flex max-w-6xl justify-center overflow-hidden">
              <div className="relative rounded">
                <Image
                  src="https://utfs.io/f/5d094c0f-04fa-4806-a594-590557d91ab5-vwhpjt.png"
                  alt="Hero Image"
                  width={1100}
                  height={550}
                  priority={true}
                  className="block rounded-[inherit] border object-contain dark:hidden"
                />

                <Image
                  src="https://utfs.io/f/12fd67e8-b23c-455f-ba6d-e9a7ed87c27d-vl0epb.png"
                  alt="Hero Image"
                  width={1100}
                  height={550}
                  priority={true}
                  className="hidden rounded-[inherit] border object-contain dark:block"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
