import { Metadata } from 'next'
import Hero from '@/components/Hero'
import Stats from '@/components/Stats'
import Services from '@/components/Services'
import GalleryPreview from '@/components/GalleryPreview'
import WhyUs from '@/components/WhyUs'

export const metadata: Metadata = {
  title: "ndossi_hair — Salon de Coiffure Afro Spécialisé",
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <Services />
      <GalleryPreview />
      <WhyUs />
    </>
  )
}
