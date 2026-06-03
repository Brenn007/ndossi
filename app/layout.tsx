import type { Metadata } from 'next'
import { Bodoni_Moda, DM_Sans } from 'next/font/google'
import './globals.css'
import LenisProvider from '@/components/LenisProvider'
import PublicLayout from '@/components/PublicLayout'
import Loader from '@/components/Loader'
import CustomCursor from '@/components/CustomCursor'
import ScrollProgress from '@/components/ScrollProgress'
import SessionProvider from '@/components/SessionProvider'

const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
})

export const metadata: Metadata = {
  title: {
    default: "ndossi_hair — Salon de Coiffure Afro Spécialisé",
    template: "%s | ndossi_hair",
  },
  description:
    "ndossi_hair, salon spécialisé en tresses afro : box braids, tresses collées, vanilles, cornrows, locks. Réservez votre créneau en ligne.",
  keywords: [
    'salon coiffure afro',
    'tresses afro',
    'box braids',
    'tresses collées',
    'vanilles',
    'cornrows',
    'locks',
    'dreadlocks',
    'coiffure femme',
    "ndossi_hair",
  ],
  openGraph: {
    title: "ndossi_hair — Salon de Coiffure Afro Spécialisé",
    description: "Spécialiste des tresses afro. Box braids, vanilles, locks, cornrows et plus.",
    type: 'website',
    locale: 'fr_FR',
  },
  twitter: {
    card: 'summary_large_image',
    title: "ndossi_hair",
    description: "Salon de coiffure afro spécialisé en tresses",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${bodoni.variable} ${dmSans.variable}`}>
      <body className="bg-cream text-dark antialiased">
        <SessionProvider>
          <Loader />
          <CustomCursor />
          <ScrollProgress />
          <LenisProvider>
            <PublicLayout>{children}</PublicLayout>
          </LenisProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
