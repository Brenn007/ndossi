'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { Heart, Shield, Sparkles, Clock } from 'lucide-react'

const reasons = [
  {
    icon: Heart,
    number: '01',
    title: 'Passion & Expertise',
    description: 'Chaque tresse est réalisée avec amour et un savoir-faire acquis au fil des années, dans le respect des techniques afro authentiques.',
  },
  {
    icon: Shield,
    number: '02',
    title: 'Soins Adaptés',
    description: 'Nous utilisons uniquement des produits de qualité, respectueux de votre cuir chevelu et adaptés à chaque type de cheveux.',
  },
  {
    icon: Sparkles,
    number: '03',
    title: 'Style Personnalisé',
    description: 'Chaque client(e) est unique. Nous prenons le temps d\'échanger sur vos envies pour créer une coiffure qui vous ressemble.',
  },
  {
    icon: Clock,
    number: '04',
    title: 'Rendez-vous Flexibles',
    description: 'Un système de réservation simple et efficace pour choisir le créneau qui correspond à votre emploi du temps.',
  },
]

export default function WhyUs() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const shouldReduce = useReducedMotion()

  return (
    <section className="py-20 sm:py-32 bg-dark overflow-hidden relative" ref={ref}>
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-terracotta/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-3/4 bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-terracotta" />
            <span className="text-terracotta font-dm text-xs tracking-[0.3em] uppercase">Notre Engagement</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h2 className="font-playfair text-4xl sm:text-5xl text-cream font-bold leading-tight">
              Pourquoi ndossi_hair ?
            </h2>
            <p className="font-dm text-cream/40 text-base max-w-xs leading-relaxed">
              Un salon pensé pour sublimer votre beauté naturelle dans un espace chaleureux.
            </p>
          </div>
        </motion.div>

        {/* Reasons grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/5 rounded-2xl overflow-hidden">
          {reasons.map((reason, i) => {
            const Icon = reason.icon
            return (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: shouldReduce ? 0 : i * 0.12,
                  ease: [0.33, 1, 0.68, 1],
                }}
                className="group relative p-8 sm:p-10 bg-dark hover:bg-white/3 transition-colors duration-400 overflow-hidden"
              >
                {/* Large number */}
                <span className="absolute top-6 right-8 font-playfair text-6xl font-bold text-white/4 select-none leading-none group-hover:text-white/6 transition-colors duration-400">
                  {reason.number}
                </span>

                {/* Icon */}
                <div className="w-11 h-11 bg-terracotta/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-terracotta/20 transition-colors duration-300">
                  <Icon size={20} className="text-terracotta" />
                </div>

                <h3 className="font-playfair text-xl font-bold text-cream mb-3 group-hover:text-gold transition-colors duration-300">
                  {reason.title}
                </h3>
                <p className="font-dm text-cream/45 text-sm leading-relaxed">
                  {reason.description}
                </p>

                {/* Bottom accent line */}
                <div className="mt-6 h-px w-0 group-hover:w-full bg-gradient-to-r from-terracotta/60 to-transparent transition-all duration-500 ease-out" />
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-14"
        >
          <a
            href="/reserver"
            className="inline-flex items-center gap-3 border border-terracotta/60 text-terracotta px-8 py-4 rounded-full font-dm text-sm tracking-wider uppercase hover:bg-terracotta hover:text-cream hover:border-terracotta transition-all duration-300"
          >
            Réserver maintenant
            <span>→</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
