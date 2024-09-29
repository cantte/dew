import FeaturesSection from '~/components/home/features'
import { PageWrapper } from '~/components/wrapper/page-wrapper'

export default function FeaturesPage() {
  return (
    <PageWrapper>
      <div className="flex w-full items-center justify-center">
        <FeaturesSection />
      </div>
    </PageWrapper>
  )
}
