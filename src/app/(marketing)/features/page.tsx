import FeaturesSection from '~/components/home/features'
import { MainNav } from '~/components/main-nav'

export default function FeaturesPage() {
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <MainNav />
      </header>
      <main className="flex flex-1 flex-col items-center gap-4 p-4 md:gap-8 md:p-6">
        <FeaturesSection />
      </main>
    </>
  )
}
