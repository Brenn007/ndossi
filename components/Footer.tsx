'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Instagram, MapPin } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/galerie', label: 'Galerie' },
  { href: '/tarifs', label: 'Tarifs' },
  { href: '/reserver', label: 'Réserver' },
]

const services = [
  'Box Braids',
  'Tresses Collées',
  'Vanilles',
  'Cornrows',
  'Locks / Dreadlocks',
  'Tresses Homme',
]


const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08 },
  }),
}

export default function Footer() {
  return (
    <footer className="bg-dark border-t border-white/5">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand column */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={fadeUp}
            className="lg:col-span-1"
          >
            <Link href="/" className="inline-block mb-4">
              <span className="font-playfair text-2xl font-bold text-cream">ndossi_hair</span>
              <p className="text-cream/35 font-dm text-xs tracking-[0.2em] uppercase mt-0.5">Salon de Coiffure Afro</p>
            </Link>
            <p className="font-dm text-sm text-cream/40 leading-relaxed max-w-xs">
              Spécialiste des tresses afro à Toulouse. Un espace chaleureux où chaque coiffure est une œuvre d&apos;art.
            </p>
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            variants={fadeUp}
          >
            <h4 className="font-playfair text-sm font-bold text-cream mb-5 tracking-wide">Navigation</h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-dm text-sm text-cream/40 hover:text-cream transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-0 h-px bg-terracotta group-hover:w-4 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="font-playfair text-sm font-bold text-cream mt-8 mb-5 tracking-wide">Prestations</h4>
            <ul className="space-y-2.5">
              {services.map((s) => (
                <li key={s}>
                  <Link
                    href="/reserver"
                    className="font-dm text-sm text-cream/35 hover:text-cream/70 transition-colors duration-300"
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={2}
            variants={fadeUp}
            className="lg:col-span-2"
          >
            <h4 className="font-playfair text-sm font-bold text-cream mb-5 tracking-wide">Contact & Infos</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={14} className="text-terracotta" />
                </div>
                <div>
                  <p className="font-dm text-sm text-cream/70">Toulouse, France</p>
                  <p className="font-dm text-xs text-cream/30 mt-0.5">Adresse communiquée par SMS</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                  <Instagram size={14} className="text-terracotta" />
                </div>
                <div>
                  <motion.a
                    href="https://instagram.com/ndossi_hair"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ color: '#C4622D' }}
                    className="font-dm text-sm text-cream/70 transition-colors duration-300"
                  >
                    @ndossi_hair
                  </motion.a>
                  <p className="font-dm text-xs text-cream/30 mt-0.5">Instagram</p>
                </div>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Bottom bar */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="border-t border-white/5 py-5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-cream/20 font-dm text-xs">
            © {new Date().getFullYear()} ndossi_hair. Tous droits réservés.
          </p>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-terracotta/60 animate-pulse" />
            <span className="text-cream/20 font-dm text-xs">Salon ouvert Mar–Sam sur rendez-vous</span>
          </div>
        </div>
      </motion.div>
    </footer>
  )
}
