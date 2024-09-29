import { FAQSection } from '~/components/home/faq'
import { PageWrapper } from '~/components/wrapper/page-wrapper'

export default function FAQPage() {
  return (
    <PageWrapper>
      <div className="my-8 flex w-full items-center justify-center">
        <div className="flex w-[90%] flex-col lg:w-[50%]">
          <h2 className="scroll-m-20 pb-[3rem] text-center font-semibold text-3xl tracking-tight lg:text-4xl">
            Preguntas frecuentes (FAQs)
          </h2>

          <FAQSection />
        </div>
      </div>
    </PageWrapper>
  )
}
