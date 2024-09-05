import { PricingSection } from '~/components/home/pricing'
import { PageWrapper } from '~/components/wrapper/page-wrapper'

export default function PricingPage() {
  return (
    <PageWrapper>
      <div className="w-full max-w-xl space-y-4">
        <div className="gap-2">
          <h1 className="text-center font-bold text-4xl">Precios</h1>
          <p className="text-muted-foreground">
            Escoge el plan que mejor se adapte a tus necesidades.
          </p>
        </div>

        <PricingSection />
      </div>
    </PageWrapper>
  )
}
