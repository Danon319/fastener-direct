import { useEffect } from 'react'
import { motion } from 'motion/react'

import CtaBannerSection from '@/components/sections/CtaBannerSection'
import FastenerDiagramSection from '@/components/sections/FastenerDiagramSection'
import Hero from '@/components/sections/Hero'
import NumbersSection from '@/components/sections/NumbersSection'
import OurValuesSection from '@/components/sections/OurValuesSection'
import PartnersSection from '@/components/sections/PartnersSection'
import ServiceProgramSection from '@/components/sections/ServiceProgramSection'
import { useMomentumLift, useElementHeight } from '@/hooks'

export default function Home() {
  const lift = useMomentumLift()
  const footerH = useElementHeight('footer')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Hero />
      <div className="h-screen" aria-hidden="true" />

      <motion.section
        style={{ y: lift }}
        className="relative z-10 rounded-2xl bg-light shadow-[0_-8px_30px_rgba(0,0,0,0.12),0_8px_30px_rgba(0,0,0,0.12)] will-change-transform"
      >
        <OurValuesSection />
        <ServiceProgramSection />
        <FastenerDiagramSection />
        <NumbersSection />
        <PartnersSection />
        <CtaBannerSection />
      </motion.section>

      <div style={{ height: footerH }} aria-hidden="true" />
    </>
  )
}
