'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import PageBanner from '@/components/PageBanner'

interface GalleryItem {
  id: string | number
  title: string
  category: 'femmes' | 'hommes'
  gradient: string
  imageUrl?: string
}


type Filter = 'tout' | 'femmes' | 'hommes'

function GalleryCard({
  item,
  index,
  onClick,
}: {
  item: GalleryItem
  index: number
  onClick: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-30px' })
  const shouldReduce = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: shouldReduce ? 0 : (index % 3) * 0.08, ease: [0.33, 1, 0.68, 1] }}
      onClick={onClick}
      className="relative overflow-hidden rounded-2xl cursor-pointer group"
      style={{
        height: index % 3 === 0 ? 320 : index % 3 === 1 ? 240 : 280,
      }}
    >
      {item.imageUrl ? (
        <img src={item.imageUrl} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient}`} />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/50 transition-all duration-400" />

      {/* Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%">
          <defs>
            <pattern id={`gp-${item.id}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#gp-${item.id})`} />
        </svg>
      </div>

      {/* Content */}
      <div className="absolute inset-0 p-5 flex flex-col justify-between">
        <span className="self-start bg-dark/30 backdrop-blur-sm text-cream/80 font-dm text-xs px-3 py-1 rounded-full">
          {item.category === 'femmes' ? 'Femmes' : 'Hommes'}
        </span>

        <motion.div
          className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
        >
          <h3 className="font-playfair text-lg text-cream font-bold">{item.title}</h3>
          <div className="flex items-center gap-2 mt-1 text-gold/80 font-dm text-xs">
            <span>Voir en grand</span>
            <span>→</span>
          </div>
        </motion.div>
      </div>

    </motion.div>
  )
}

export default function GaleriePage() {
  const [filter, setFilter] = useState<Filter>('tout')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const shouldReduce = useReducedMotion()

  useEffect(() => {
    fetch('/api/gallery')
      .then((r) => r.json())
      .then((data: GalleryItem[]) => {
        if (Array.isArray(data) && data.length > 0) setGalleryItems(data)
      })
      .catch(() => {})
  }, [])

  const filtered = filter === 'tout'
    ? galleryItems
    : galleryItems.filter((i) => i.category === filter)

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)
  const prevItem = () => setLightboxIndex((i) => (i !== null ? (i === 0 ? filtered.length - 1 : i - 1) : null))
  const nextItem = () => setLightboxIndex((i) => (i !== null ? (i === filtered.length - 1 ? 0 : i + 1) : null))

  const currentItem = lightboxIndex !== null ? filtered[lightboxIndex] : null

  return (
    <div className="min-h-screen bg-cream pb-20">
      {/* Lightbox */}
      <AnimatePresence>
        {currentItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-dark/95 backdrop-blur-sm p-4"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
              className="relative max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={`w-full h-96 sm:h-[500px] rounded-2xl relative overflow-hidden ${!currentItem.imageUrl ? `bg-gradient-to-br ${currentItem.gradient}` : ''}`}
              >
                {currentItem.imageUrl && (
                  <img src={currentItem.imageUrl} alt={currentItem.title} className="absolute inset-0 w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 opacity-5">
                  <svg width="100%" height="100%">
                    <defs>
                      <pattern id="lb-pattern" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                        <circle cx="15" cy="15" r="1.5" fill="white" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#lb-pattern)" />
                  </svg>
                </div>
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <span className="text-cream/60 font-dm text-xs tracking-wider uppercase mb-1">
                    {currentItem.category === 'femmes' ? 'Femmes' : 'Hommes'}
                  </span>
                  <h2 className="font-playfair text-2xl text-cream font-bold">{currentItem.title}</h2>
                </div>
              </div>

              {/* Controls */}
              <button
                onClick={closeLightbox}
                className="absolute -top-4 -right-4 w-10 h-10 bg-cream rounded-full flex items-center justify-center text-dark hover:bg-terracotta hover:text-cream transition-colors duration-200"
              >
                <X size={18} />
              </button>
              <button
                onClick={prevItem}
                className="absolute top-1/2 -translate-y-1/2 -left-5 w-10 h-10 bg-cream rounded-full flex items-center justify-center text-dark hover:bg-terracotta hover:text-cream transition-colors duration-200"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={nextItem}
                className="absolute top-1/2 -translate-y-1/2 -right-5 w-10 h-10 bg-cream rounded-full flex items-center justify-center text-dark hover:bg-terracotta hover:text-cream transition-colors duration-200"
              >
                <ChevronRight size={18} />
              </button>

              {/* Counter */}
              <p className="text-center text-cream/40 font-dm text-sm mt-4">
                {(lightboxIndex ?? 0) + 1} / {filtered.length}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <PageBanner
        label="Nos Réalisations"
        title="La Galerie"
        subtitle="Découvrez nos créations et laissez-vous inspirer."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-2 mb-12"
        >
          {(['tout', 'femmes', 'hommes'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-6 py-2.5 rounded-full font-dm text-sm tracking-wider capitalize transition-all duration-300',
                filter === f
                  ? 'bg-terracotta text-cream'
                  : 'bg-white text-dark/60 hover:text-terracotta border border-chocolate/10 hover:border-terracotta/30'
              )}
            >
              {f === 'tout' ? 'Tout' : f === 'femmes' ? 'Femmes' : 'Hommes'}
            </button>
          ))}
        </motion.div>

        {/* Masonry grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4"
          >
            {filtered.length === 0 && (
              <div className="col-span-3 text-center py-24">
                <p className="font-playfair text-2xl text-dark/30 mb-3">La galerie arrive bientôt</p>
                <p className="font-dm text-sm text-dark/40">Nos réalisations seront bientôt disponibles ici.</p>
              </div>
            )}
            {filtered.map((item, i) => (
              <div key={item.id} className="break-inside-avoid mb-4">
                <GalleryCard
                  item={item}
                  index={i}
                  onClick={() => openLightbox(i)}
                />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-16"
        >
          <p className="font-dm text-dark/60 mb-6">Envie d&apos;une coiffure unique ?</p>
          <a
            href="/reserver"
            className="inline-flex items-center gap-3 bg-terracotta text-cream px-8 py-4 rounded-full font-dm text-sm tracking-wider uppercase hover:bg-terracotta-dark transition-colors duration-300"
          >
            Réserver votre RDV
            <span>→</span>
          </a>
        </motion.div>
      </div>
    </div>
  )
}
