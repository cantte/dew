import { PricingSection } from '~/components/home/pricing'
import { PageWrapper } from '~/components/wrapper/page-wrapper'

export default function PricingPage() {
  return (
    <PageWrapper>
      <div className="my-8 flex w-full items-center justify-center">
        <div className="w-full max-w-xl space-y-4 p-4">
          <div className="grid gap-2 text-center">
            <h2 className="scroll-m-20 text-center font-semibold text-3xl tracking-tight lg:text-4xl">
              Precios
            </h2>
            <p className="text-muted-foreground leading-8">
              Escoge el plan que mejor se adapte a tus necesidades.
            </p>
          </div>

          <PricingSection />
        </div>
      </div>
    </PageWrapper>
  )
}
