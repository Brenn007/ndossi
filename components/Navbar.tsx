'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/galerie', label: 'Galerie' },
  { href: '/tarifs', label: 'Tarifs' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  const isDark = !scrolled

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          isDark
            ? 'bg-transparent py-5'
            : 'bg-cream/95 backdrop-blur-md shadow-sm py-3'
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group">
            <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <Image
                src="/logo.png"
                alt="ndossi_hair"
                width={96}
                height={96}
                className="rounded-full"
                priority
              />
            </motion.div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {!pathname.startsWith('/admin') && navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative font-dm text-sm tracking-wider uppercase transition-colors duration-300',
                  isDark ? 'text-cream/80 hover:text-cream' : 'text-dark hover:text-terracotta',
                  pathname === link.href && (isDark ? 'text-cream' : 'text-terracotta')
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-px bg-terracotta"
                  />
                )}
              </Link>
            ))}
            {!pathname.startsWith('/admin') && (
              <Link href="/reserver">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className={cn(
                    'px-5 py-2 rounded-full font-dm text-sm tracking-wider uppercase transition-all duration-300',
                    isDark
                      ? 'bg-white/10 backdrop-blur-sm border border-white/20 text-cream hover:bg-terracotta hover:border-terracotta'
                      : 'bg-terracotta text-cream hover:bg-terracotta-dark'
                  )}
                >
                  Prendre RDV
                </motion.button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(true)}
            className={cn(
              'md:hidden p-2 rounded-lg transition-colors duration-300',
              isDark ? 'text-cream' : 'text-dark'
            )}
            aria-label="Ouvrir le menu"
          >
            <Menu size={24} />
          </button>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-[#1A0A00] flex flex-col"
          >
            {/* Close button */}
            <div className="flex justify-end px-4 pt-5">
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 text-cream rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Fermer le menu"
              >
                <motion.div
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={24} />
                </motion.div>
              </button>
            </div>

            {/* Top decorative line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="h-px bg-gradient-to-r from-transparent via-terracotta/40 to-transparent origin-left"
            />

            <div className="flex flex-col items-center justify-center flex-1 gap-6 px-8">
              {/* Brand */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center mb-4"
              >
                <Image src="/logo.png" alt="ndossi_hair" width={80} height={80} className="rounded-full mx-auto" />
              </motion.div>

              {!pathname.startsWith('/admin') && navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.08, duration: 0.35 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'font-playfair text-4xl text-cream hover:text-terracotta transition-colors duration-300',
                      pathname === link.href && 'text-terracotta'
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {!pathname.startsWith('/admin') && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.3 }}
                  className="mt-4"
                >
                  <Link href="/reserver" onClick={() => setMobileOpen(false)}>
                    <button className="bg-terracotta text-cream px-10 py-3.5 rounded-full font-dm text-sm tracking-wider uppercase hover:bg-terracotta-dark transition-colors duration-300">
                      Prendre RDV
                    </button>
                  </Link>
                </motion.div>
              )}
            </div>

            {/* Bottom */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="pb-8 flex flex-col items-center gap-2"
            >
              <div className="h-px w-16 bg-white/10 mb-4" />
              <span className="text-cream/30 font-dm text-sm">@ndossi_hair</span>
              <span className="text-cream/20 font-dm text-xs tracking-wider uppercase">Toulouse · Sur rendez-vous</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
