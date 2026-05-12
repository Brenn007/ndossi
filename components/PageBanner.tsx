'use client'

import { motion } from 'framer-motion'

interface PageBannerProps {
  label: string
  title: string
  subtitle?: string
  children?: React.ReactNode
}

export default function PageBanner({ label, title, subtitle, children }: PageBannerProps) {
  return (
    <div className="relative bg-gradient-to-br from-dark via-chocolate to-dark pt-28 pb-16 overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent" />

      {/* Braid SVG pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="banner-braid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M30 0 Q45 15 30 30 Q15 45 30 60" stroke="#D4A853" strokeWidth="1" fill="none" />
              <path d="M0 30 Q15 15 30 30 Q45 45 60 30" stroke="#C4622D" strokeWidth="1" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#banner-braid)" />
        </svg>
      </div>

      {/* Decorative blurs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-terracotta/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/6 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-terracotta/60" />
            <span className="text-gold font-dm text-xs tracking-[0.3em] uppercase">{label}</span>
            <div className="w-8 h-px bg-terracotta/60" />
          </div>
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl text-cream font-bold mb-4">
            {title}
          </h1>
          {subtitle && (
            <p className="font-dm text-cream/60 text-base sm:text-lg max-w-xl mx-auto">
              {subtitle}
            </p>
          )}
          {children}
        </motion.div>
      </div>
    </div>
  )
}
