import { Metadata } from 'next'
import Hero from '@/components/Hero'
import Stats from '@/components/Stats'
import Services from '@/components/Services'
import GalleryPreview from '@/components/GalleryPreview'
import WhyUs from '@/components/WhyUs'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "ndossi_hair — Salon de Coiffure Afro Spécialisé",
}

export default async function HomePage() {
  const firstImage = await prisma.galleryImage.findFirst({
    where: { imageUrl: { not: '' } },
    orderBy: { order: 'asc' },
  }).catch(() => null)

  return (
    <>
      <Hero bgImage={firstImage?.imageUrl ?? null} />
      <Stats />
      <Services />
      <GalleryPreview />
      <WhyUs />
    </>
  )
}
