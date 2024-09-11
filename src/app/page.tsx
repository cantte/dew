import { FAQSection } from '~/components/home/faq'
import FeaturesSection from '~/components/home/features'
import { HeroSection } from '~/components/home/hero-section'
import { SideBySide } from '~/components/home/side-by-side'
import { PageWrapper } from '~/components/wrapper/page-wrapper'

export default function Home() {
  return (
    <PageWrapper>
      <div className="mt-[1rem] flex w-full flex-col items-center justify-center p-3">
        <HeroSection />
      </div>

      <div className="my-[8rem] flex w-full items-center justify-center">
        <SideBySide />
      </div>

      <div className="flex w-full flex-col items-center justify-center p-2">
        <FeaturesSection />
      </div>

      <div className="my-[8rem] flex w-full items-center justify-center">
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
