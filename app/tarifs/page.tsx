'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import PageBanner from '@/components/PageBanner'

const lengths = ['Épaules', 'Mi-dos', 'Bas du dos', 'Fesses']

const femmesPrestations = [
  {
    name: 'Knotless',
    description: 'Tresses sans nœud à la racine, légères et naturelles',
    rows: [
      { label: 'Petite', prices: [50, 55, 60, 65] },
      { label: 'Moyenne', prices: [45, 50, 55, 60] },
      { label: 'Grosse', prices: [40, 45, 50, 55] },
    ],
    gradient: 'from-terracotta/20 to-chocolate/10',
    icon: '✦',
  },
  {
    name: 'Vanilles',
    description: 'Twists fondus à l\'apparence naturelle et élégante',
    rows: [
      { label: 'Petite', prices: [45, 50, 55, 60] },
      { label: 'Moyenne', prices: [40, 45, 50, 55] },
      { label: 'Grosse', prices: [35, 40, 45, 50] },
    ],
    gradient: 'from-gold/20 to-terracotta/10',
    icon: '❋',
  },
  {
    name: 'Fulani',
    description: 'Tresses d\'inspiration fulani, élégantes et culturellement riches',
    rows: [
      { label: 'Petite', prices: [55, 60, 65, 70] },
      { label: 'Moyenne', prices: [50, 55, 60, 65] },
      { label: 'Grosse', prices: [45, 50, 55, 60] },
    ],
    gradient: 'from-chocolate/15 to-terracotta/10',
    icon: '◈',
  },
  {
    name: 'Nattes',
    description: 'Nattes classiques, du carré jusqu\'aux fesses',
    rows: [
      { label: '2–4 nattes', prices: [25, 30, 35, 40] },
      { label: '6–8 nattes', prices: [30, 35, 40, 45] },
      { label: '10–12 nattes', prices: [35, 40, 45, 50] },
    ],
    gradient: 'from-terracotta/15 to-gold/10',
    icon: '⟁',
  },
]

const extras = [
  { name: 'Locks Crochet', price: '60€', note: null },
  { name: '+ option Boho', price: '+5€', note: 'En supplément des Locks Crochet' },
]

const hommesPrestations = [
  {
    name: 'Nattes',
    rows: [
      { label: '2–4 nattes', price: 20 },
      { label: '6–8 nattes', price: 25 },
      { label: '10–12 nattes', price: 30 },
      { label: '14–16 nattes', price: 35 },
    ],
    icon: '⟁',
  },
  {
    name: 'Vanilles',
    rows: [{ label: 'Toutes longueurs', price: 30 }],
    icon: '❋',
  },
  {
    name: 'Barrel Twist',
    rows: [{ label: 'Toutes longueurs', price: 30 }],
    icon: '◇',
  },
]

function SectionTitle({ label, title, light = false }: { label: string; title: string; light?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="mb-10"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-8 h-px ${light ? 'bg-gold' : 'bg-gold'}`} />
        <span className={`font-dm text-xs tracking-[0.3em] uppercase ${light ? 'text-gold' : 'text-terracotta'}`}>
          {label}
        </span>
      </div>
      <h2 className={`font-playfair text-3xl sm:text-4xl font-bold ${light ? 'text-cream' : 'text-dark'}`}>
        {title}
      </h2>
    </motion.div>
  )
}

function PrestationTable({ prestation, index, light = false }: {
  prestation: typeof femmesPrestations[0]
  index: number
  light?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  const shouldReduce = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: shouldReduce ? 0 : index * 0.08 }}
      className={`rounded-2xl overflow-hidden border ${light ? 'border-white/8' : 'border-chocolate/8'}`}
    >
      {/* Header */}
      <div className={`px-6 py-4 flex items-center gap-3 ${light ? 'bg-white/5' : 'bg-dark/3'}`}>
        <span className="text-terracotta text-xl">{prestation.icon}</span>
        <div>
          <h3 className={`font-playfair text-lg font-bold ${light ? 'text-cream' : 'text-dark'}`}>
            {prestation.name}
          </h3>
          {'description' in prestation && (
            <p className={`font-dm text-xs mt-0.5 ${light ? 'text-cream/40' : 'text-dark/40'}`}>
              {prestation.description}
            </p>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`${light ? 'bg-white/3 border-b border-white/5' : 'bg-dark/3 border-b border-chocolate/6'}`}>
              <th className={`text-left px-6 py-3 font-dm text-xs tracking-wider uppercase ${light ? 'text-cream/30' : 'text-dark/30'}`}>
                Taille
              </th>
              {lengths.map((l) => (
                <th key={l} className={`text-center px-4 py-3 font-dm text-xs tracking-wider uppercase ${light ? 'text-cream/30' : 'text-dark/30'}`}>
                  {l}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {prestation.rows.map((row, i) => (
              <tr
                key={row.label}
                className={`transition-colors duration-200 ${
                  light
                    ? `${i % 2 === 0 ? '' : 'bg-white/2'} hover:bg-terracotta/8 border-b border-white/4`
                    : `${i % 2 === 0 ? '' : 'bg-dark/2'} hover:bg-terracotta/5 border-b border-chocolate/5`
                } last:border-0`}
              >
                <td className={`px-6 py-3.5 font-dm text-sm font-medium ${light ? 'text-cream/70' : 'text-dark/70'}`}>
                  {row.label}
                </td>
                {'prices' in row
                  ? row.prices.map((price, pi) => (
                    <td key={pi} className="px-4 py-3.5 text-center">
                      <span className={`font-playfair text-base font-bold ${
                        price === Math.min(...row.prices)
                          ? 'text-terracotta'
                          : light ? 'text-cream' : 'text-dark'
                      }`}>
                        {price}€
                      </span>
                    </td>
                  ))
                  : null
                }
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

function HommeTable({ prestation, index }: { prestation: typeof hommesPrestations[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  const shouldReduce = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: shouldReduce ? 0 : index * 0.1 }}
      className="rounded-2xl overflow-hidden border border-white/8"
    >
      <div className="px-6 py-4 flex items-center gap-3 bg-white/5">
        <span className="text-terracotta text-xl">{prestation.icon}</span>
        <h3 className="font-playfair text-lg font-bold text-cream">{prestation.name}</h3>
      </div>
      <table className="w-full">
        <tbody>
          {prestation.rows.map((row, i) => (
            <tr
              key={row.label}
              className={`border-b border-white/5 last:border-0 hover:bg-terracotta/8 transition-colors duration-200 ${
                i % 2 === 0 ? '' : 'bg-white/2'
              }`}
            >
              <td className="px-6 py-3.5 font-dm text-sm text-cream/70">{row.label}</td>
              <td className="px-6 py-3.5 text-right">
                <span className="font-playfair text-xl font-bold text-terracotta">{row.price}€</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  )
}

export default function TarifsPage() {
  const ctaRef = useRef<HTMLDivElement>(null)
  const ctaInView = useInView(ctaRef, { once: true })

  return (
    <div className="min-h-screen bg-cream">

      <PageBanner
        label="ndossi_hair · Toulouse"
        title="Nos Tarifs"
        subtitle="Des prix clairs pour chaque style. Les tarifs varient selon la longueur et la taille des tresses."
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center justify-center gap-3 mt-8"
        >
          <a href="#femmes" className="px-5 py-2 rounded-full bg-terracotta text-cream font-dm text-sm tracking-wider">Femmes</a>
          <a href="#hommes" className="px-5 py-2 rounded-full bg-white/8 border border-white/15 text-cream/70 hover:text-cream font-dm text-sm tracking-wider transition-colors duration-300">Hommes</a>
        </motion.div>
      </PageBanner>

      {/* Note tarifaire */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-terracotta/8 border-b border-terracotta/15 py-3"
      >
        <p className="text-center font-dm text-xs text-terracotta tracking-wide">
          ✦ Les prix peuvent varier en fonction de la difficulté du modèle
        </p>
      </motion.div>

      {/* ── FEMMES ── */}
      <section id="femmes" className="py-16 sm:py-24 bg-cream scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle label="Tarifs Femmes" title="Prestations Femmes" />

          {/* Légende longueurs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center gap-3 mb-8"
          >
            <span className="font-dm text-xs text-dark/40 uppercase tracking-wider">Longueurs :</span>
            {lengths.map((l, i) => (
              <span key={l} className="flex items-center gap-1.5 font-dm text-xs text-dark/60">
                <span className="w-1.5 h-1.5 rounded-full bg-terracotta/50" />
                {l}
              </span>
            ))}
          </motion.div>

          <div className="space-y-5">
            {femmesPrestations.map((p, i) => (
              <PrestationTable key={p.name} prestation={p} index={i} />
            ))}
          </div>

          {/* Extras */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 rounded-2xl border border-gold/20 bg-gold/5 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gold/15 flex items-center gap-2">
              <span className="text-gold text-lg">◎</span>
              <h3 className="font-playfair text-lg font-bold text-dark">Locks & Options</h3>
            </div>
            <table className="w-full">
              <tbody>
                {extras.map((e, i) => (
                  <tr key={e.name} className={`border-b border-gold/10 last:border-0 ${i % 2 === 0 ? '' : 'bg-gold/3'}`}>
                    <td className="px-6 py-3.5">
                      <span className="font-dm text-sm text-dark/70">{e.name}</span>
                      {e.note && <p className="font-dm text-xs text-dark/35 mt-0.5">{e.note}</p>}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <span className="font-playfair text-xl font-bold text-gold">{e.price}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* ── HOMMES ── */}
      <section id="hommes" className="py-16 sm:py-24 bg-dark relative overflow-hidden scroll-mt-20">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-terracotta/30 to-transparent" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-terracotta/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle label="Tarifs Hommes" title="Prestations Hommes" light />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {hommesPrestations.map((p, i) => (
              <HommeTable key={p.name} prestation={p} index={i} />
            ))}
          </div>

          {/* Note */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 text-center font-dm text-xs text-cream/25 italic"
          >
            * Les prix peuvent varier en fonction de la difficulté du modèle.
          </motion.p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-cream" ref={ctaRef}>
        <div className="max-w-2xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-px bg-gold" />
              <span className="text-terracotta font-dm text-xs tracking-[0.3em] uppercase">Réservation</span>
              <div className="w-8 h-px bg-gold" />
            </div>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-dark mb-3">
              Prête à vous faire coiffer ?
            </h2>
            <p className="font-dm text-dark/50 text-base mb-8">
              Réservez votre créneau en ligne, confirmation immédiate.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/reserver">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="bg-terracotta text-cream px-8 py-4 rounded-full font-dm text-sm tracking-wider uppercase hover:bg-terracotta-dark transition-colors duration-300 shadow-glow"
                >
                  Prendre rendez-vous →
                </motion.button>
              </Link>
              <Link href="/galerie">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="border border-chocolate/20 text-dark/60 px-8 py-4 rounded-full font-dm text-sm tracking-wider uppercase hover:border-terracotta hover:text-terracotta transition-colors duration-300"
                >
                  Voir la galerie
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
