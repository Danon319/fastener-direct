import { useEffect } from 'react'

import CtaBannerSection from '@/components/sections/CtaBannerSection'
import FastenerDiagramSection from '@/components/sections/FastenerDiagramSection'
import Hero from '@/components/sections/Hero'
import HeroHeader from '@/components/sections/HeroHeader'
import NumbersSection from '@/components/sections/NumbersSection'
import OurValuesSection from '@/components/sections/OurValuesSection'
import PartnersSection from '@/components/sections/PartnersSection'
import ServiceProgramSection from '@/components/sections/ServiceProgramSection'
import { SupportButton } from '@/components/ui'
import { useElementHeight } from '@/hooks'

export default function Home() {
  const footerH = useElementHeight('footer')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Hero />
      <HeroHeader />
      <div className="h-screen" aria-hidden="true" />

      <section className="relative z-wrapper rounded-2xl bg-light shadow-[0_-8px_30px_rgba(0,0,0,0.12),0_8px_30px_rgba(0,0,0,0.12)]">
        <OurValuesSection />
        <ServiceProgramSection />
        <FastenerDiagramSection />
        <NumbersSection />
        <PartnersSection />
        <CtaBannerSection />
      </section>

      <div style={{ height: footerH }} aria-hidden="true" />

      <SupportButton />
    </>
  )
}
