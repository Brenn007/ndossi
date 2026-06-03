'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { Clock, ArrowUpRight } from 'lucide-react'

interface Service {
  title: string
  description: string
  icon: string
  gradient: string
  category: string
  duration: string
  from: string
  index: string
}

const services: Service[] = [
  {
    title: 'Knotless / Box Braids',
    description: 'Tresses knotless sans nœud à la racine — légères et naturelles. Disponibles en petite, moyenne ou grosse taille, selon la longueur souhaitée.',
    icon: '✦',
    gradient: 'from-terracotta/20 to-chocolate/10',
    category: 'Femmes',
    duration: '3–6h',
    from: 'À partir de 40€',
    index: '01',
  },
  {
    title: 'Vanilles',
    description: 'Twists fondus à l\'apparence naturelle. Disponibles en petite, moyenne ou grosse taille, du carré jusqu\'aux fesses.',
    icon: '❋',
    gradient: 'from-gold/20 to-terracotta/10',
    category: 'Femmes',
    duration: '2–4h',
    from: 'À partir de 35€',
    index: '02',
  },
  {
    title: 'Fulani Braids',
    description: 'Tresses d\'inspiration fulani — élégantes et culturellement riches. En petite, moyenne ou grosse taille selon vos envies.',
    icon: '◈',
    gradient: 'from-chocolate/20 to-dark/10',
    category: 'Femmes',
    duration: '3–5h',
    from: 'À partir de 45€',
    index: '03',
  },
  {
    title: 'Nattes',
    description: 'Nattes classiques pour femmes et hommes. De 2 à 12 nattes selon le style voulu, avec tarif dégressif.',
    icon: '⟁',
    gradient: 'from-terracotta/15 to-gold/15',
    category: 'Femmes & Hommes',
    duration: '1–3h',
    from: 'À partir de 20€',
    index: '04',
  },
  {
    title: 'Locks Crochet',
    description: 'Locks au crochet pour un résultat naturel et immédiat. Option Boho disponible en supplément.',
    icon: '◎',
    gradient: 'from-gold/20 to-chocolate/20',
    category: 'Femmes',
    duration: '3–6h',
    from: 'À partir de 60€',
    index: '05',
  },
  {
    title: 'Vanilles & Barrel Twist Homme',
    description: 'Vanilles et Barrel Twists spécialement adaptés pour les hommes. Style soigné et contemporain.',
    icon: '◇',
    gradient: 'from-chocolate/20 to-terracotta/10',
    category: 'Hommes',
    duration: '1–2h',
    from: 'À partir de 30€',
    index: '06',
  },
]

export default function Services() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const shouldReduce = useReducedMotion()

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduce ? 0 : 0.08,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] },
    },
  }

  return (
    <section className="py-20 sm:py-32 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-16 gap-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-gold" />
              <span className="text-terracotta font-dm text-xs tracking-[0.3em] uppercase">Nos Prestations</span>
            </div>
            <h2 className="font-playfair text-4xl sm:text-5xl text-dark font-bold leading-tight">
              L&apos;art des tresses
            </h2>
          </div>
          <p className="font-dm text-dark/50 text-base max-w-xs leading-relaxed">
            Chaque coiffure est une création unique, réalisée avec passion et expertise.
          </p>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={cardVariants}
              whileHover={shouldReduce ? {} : { y: -6, boxShadow: '0 24px 60px rgba(196, 98, 45, 0.12)' }}
              transition={{ duration: 0.2 }}
              className={`relative p-7 rounded-2xl bg-gradient-to-br ${service.gradient} border border-chocolate/5 hover:border-terracotta/25 transition-all duration-300 group overflow-hidden flex flex-col`}
            >
              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-terracotta/0 to-terracotta/5 opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-2xl pointer-events-none" />

              {/* Number + icon row */}
              <div className="relative z-10 flex items-start justify-between mb-5">
                <span className="font-playfair text-4xl font-bold text-chocolate/15 select-none leading-none">
                  {service.index}
                </span>
                <span className="text-terracotta text-2xl">{service.icon}</span>
              </div>

              {/* Category badge */}
              <div className="relative z-10 mb-3">
                <span className="inline-block bg-terracotta/10 text-terracotta text-xs font-dm tracking-wider px-3 py-1 rounded-full">
                  {service.category}
                </span>
              </div>

              {/* Title */}
              <h3 className="relative z-10 font-playfair text-xl font-bold text-dark mb-3 group-hover:text-terracotta transition-colors duration-300">
                {service.title}
              </h3>

              {/* Description */}
              <p className="relative z-10 font-dm text-dark/55 text-sm leading-relaxed flex-1">
                {service.description}
              </p>

              {/* Separator */}
              <div className="relative z-10 mt-5 mb-4">
                <div className="w-full h-px bg-chocolate/8 group-hover:bg-terracotta/20 transition-colors duration-500" />
              </div>

              {/* Footer: duration + price + CTA */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5 text-dark/40">
                    <Clock size={11} />
                    <span className="font-dm text-xs">{service.duration}</span>
                  </div>
                  <span className="font-dm text-xs text-terracotta font-medium">{service.from}</span>
                </div>
                <Link href="/reserver">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-8 h-8 rounded-full bg-terracotta/10 group-hover:bg-terracotta flex items-center justify-center transition-colors duration-300"
                  >
                    <ArrowUpRight size={14} className="text-terracotta group-hover:text-cream transition-colors duration-300" />
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-14"
        >
          <Link
            href="/reserver"
            className="inline-flex items-center gap-3 bg-terracotta text-cream px-8 py-4 rounded-full font-dm text-sm tracking-wider uppercase hover:bg-terracotta-dark transition-colors duration-300 shadow-glow"
          >
            Prendre rendez-vous
            <span>→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
