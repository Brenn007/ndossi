'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

interface GalleryItem {
  id: string
  title: string
  category: string
  gradient: string
  imageUrl: string
}

const SIZES = ['tall', 'normal', 'normal', 'wide', 'normal', 'tall'] as const
const FALLBACK_GRADIENT = 'from-[#3B1F0E] via-[#C4622D] to-[#D4A853]'

function GalleryCard({ item, index, size }: { item: GalleryItem; index: number; size: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const shouldReduce = useReducedMotion()

  const isTall = size === 'tall'
  const isWide = size === 'wide'

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.94, y: 20 }}
      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: index * 0.07, ease: [0.33, 1, 0.68, 1] }}
      className={`relative overflow-hidden rounded-2xl group cursor-pointer ${
        isTall ? 'row-span-2' : ''
      } ${isWide ? 'col-span-2 sm:col-span-1 lg:col-span-2' : ''}`}
      style={{ minHeight: isTall ? '420px' : '190px' }}
      whileHover={shouldReduce ? {} : { scale: 1.01 }}
    >
      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient || FALLBACK_GRADIENT} transition-transform duration-700 group-hover:scale-105`} />
      )}

      {/* Dot pattern overlay */}
      {!item.imageUrl && (
        <div className="absolute inset-0 opacity-[0.07]">
          <svg width="100%" height="100%">
            <defs>
              <pattern id={`dots-${index}`} x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="#FAF7F2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#dots-${index})`} />
          </svg>
        </div>
      )}

      <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/50 transition-colors duration-400" />

      <div className="absolute top-4 left-4 z-10">
        <span className="bg-dark/30 backdrop-blur-sm text-cream/90 font-dm text-xs px-3 py-1.5 rounded-full tracking-wider border border-white/10">
          {item.category === 'femmes' ? 'Femmes' : item.category === 'hommes' ? 'Hommes' : item.category}
        </span>
      </div>

      <motion.div className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <ArrowUpRight size={14} className="text-cream" />
      </motion.div>

      <div className="absolute inset-0 flex flex-col justify-end p-5 z-10 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-350">
        <span className="font-dm text-xs text-gold/80 tracking-widest uppercase mb-1">
          {item.category === 'femmes' ? 'Femmes' : item.category === 'hommes' ? 'Hommes' : item.category}
        </span>
        <h3 className="font-playfair text-lg text-cream font-bold leading-tight">{item.title}</h3>
        <div className="mt-3 flex items-center gap-2 text-cream/60 font-dm text-xs">
          <span>Voir plus</span>
          <span>→</span>
        </div>
      </div>
    </motion.div>
  )
}

export default function GalleryPreview() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [items, setItems] = useState<GalleryItem[]>([])

  useEffect(() => {
    fetch('/api/gallery')
      .then((r) => r.json())
      .then((data: GalleryItem[]) => {
        if (Array.isArray(data)) setItems(data.slice(0, 6))
      })
      .catch(() => {})
  }, [])

  return (
    <section className="py-20 sm:py-32 bg-cream" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-px bg-gold" />
              <span className="text-terracotta font-dm text-xs tracking-[0.3em] uppercase">Nos Réalisations</span>
            </div>
            <h2 className="font-playfair text-4xl sm:text-5xl text-dark font-bold">La galerie</h2>
          </div>
          <Link href="/galerie">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group flex items-center gap-2 bg-dark text-cream px-5 py-2.5 rounded-full font-dm text-xs tracking-wider uppercase hover:bg-terracotta transition-colors duration-300"
            >
              Voir tout
              <ArrowUpRight size={14} className="group-hover:rotate-12 transition-transform duration-300" />
            </motion.button>
          </Link>
        </motion.div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-playfair text-2xl text-dark/25 mb-2">La galerie arrive bientôt</p>
            <p className="font-dm text-sm text-dark/35">Nos réalisations seront disponibles ici.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[190px]">
            {items.map((item, i) => (
              <GalleryCard key={item.id} item={item} index={i} size={SIZES[i % SIZES.length]} />
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-dark/5 border border-chocolate/8"
        >
          <div>
            <p className="font-playfair text-lg font-bold text-dark">Envie d&apos;une nouvelle coiffure ?</p>
            <p className="font-dm text-sm text-dark/50 mt-0.5">Prenez rendez-vous dès maintenant, c&apos;est rapide.</p>
          </div>
          <Link href="/reserver">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="shrink-0 bg-terracotta text-cream px-6 py-3 rounded-full font-dm text-sm tracking-wider uppercase hover:bg-terracotta-dark transition-colors duration-300"
            >
              Réserver →
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
