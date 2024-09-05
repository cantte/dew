import { FAQSection } from '~/components/home/faq'
import { PageWrapper } from '~/components/wrapper/page-wrapper'

export default function FAQPage() {
  return (
    <PageWrapper>
      <div className="w-full max-w-xl space-y-4">
        <h1 className="font-bold text-4xl">Preguntas frecuentes</h1>

        <FAQSection />
      </div>
    </PageWrapper>
  )
}
