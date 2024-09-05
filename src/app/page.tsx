import FeaturesSection from '~/components/home/features'
import { HeroSection } from '~/components/home/hero-section'
import { PageWrapper } from '~/components/wrapper/page-wrapper'

export default function Home() {
  return (
    <PageWrapper>
      <div className="mt-[1rem] flex w-full flex-col items-center justify-center p-3">
        <HeroSection />
      </div>

      <div className="my-[8rem] flex w-full items-center justify-center">
        <FeaturesSection />
      </div>
    </PageWrapper>
  )
}
