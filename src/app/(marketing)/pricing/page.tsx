import { PricingSection } from '~/components/home/pricing'
import { MainNav } from '~/components/main-nav'

export default function PricingPage() {
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <MainNav />
      </header>
      <main className="flex flex-1 flex-col items-center gap-4 p-4 md:gap-8 md:p-6">
        <div className="gap-2">
          <h1 className="text-center font-bold text-4xl">Precios</h1>
          <p className="text-muted-foreground">
            Escoge el plan que mejor se adapte a tus necesidades.
          </p>
        </div>

        <PricingSection />
      </main>
    </>
  )
}
