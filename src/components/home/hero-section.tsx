import { ArrowRightIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '~/components/ui/button'

export const HeroSection = () => {
  return (
    <div className="mt-[3rem] flex flex-col items-center justify-center leading-6">
      <h1 className="max-w-[1120px] scroll-m-20 bg-gradient-to-b text-center font-semibold text-4xl tracking-tight sm:text-4xl md:text-6xl lg:text-7xl">
        Simplifica, Factura, Crece
      </h1>

      <p className="mx-auto mt-4 max-w-[700px] text-center text-muted-foreground text-xl">
        Facturación electrónica e inventario simplificados para impulsar tu
        negocio
      </p>

      <div className="mt-5 flex items-center justify-center gap-3">
        <Button size="lg" asChild>
          <Link href="/dashboard">
            Empezar ahora <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Link>
        </Button>

        <Button size="lg" variant="outline" asChild>
          <Link href="/features">Saber más</Link>
        </Button>
      </div>

      <div>
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
  )
}
