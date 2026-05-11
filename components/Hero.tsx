'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

const titleWords = ['Tresses', '&', 'Beauté', 'Authentique']

function FloatingShape({ x, y, size, opacity }: { x: number; y: number; size: number; opacity: number }) {
  return (
    <motion.div
      className="absolute rounded-full border border-gold/20"
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size }}
      animate={{
        y: [0, -20, 0],
        opacity: [opacity, opacity * 0.6, opacity],
      }}
      transition={{
        duration: 4 + Math.random() * 2,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: Math.random() * 2,
      }}
    />
  )
}

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', shouldReduceMotion ? '0%' : '30%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', shouldReduceMotion ? '0%' : '15%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 })
  const springMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 })

  useEffect(() => {
    if (shouldReduceMotion) return
    const handleMouse = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window
      mouseX.set((e.clientX / innerWidth - 0.5) * 30)
      mouseY.set((e.clientY / innerHeight - 0.5) * 20)
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [mouseX, mouseY, shouldReduceMotion])

  const shapes = [
    { x: 10, y: 20, size: 120, opacity: 0.3 },
    { x: 80, y: 15, size: 80, opacity: 0.2 },
    { x: 70, y: 70, size: 150, opacity: 0.15 },
    { x: 15, y: 65, size: 90, opacity: 0.25 },
    { x: 50, y: 85, size: 60, opacity: 0.2 },
    { x: 88, y: 50, size: 40, opacity: 0.15 },
  ]

  return (
    <div ref={ref} className="relative h-screen min-h-[600px] overflow-hidden">
      {/* Background gradient */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <div className="absolute inset-0 bg-gradient-to-br from-dark via-chocolate to-dark" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent" />

        {/* Decorative SVG pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="braid-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M30 0 Q45 15 30 30 Q15 45 30 60" stroke="#D4A853" strokeWidth="1" fill="none" />
                <path d="M0 30 Q15 15 30 30 Q45 45 60 30" stroke="#C4622D" strokeWidth="1" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#braid-pattern)" />
          </svg>
        </div>

        {!shouldReduceMotion && shapes.map((s, i) => (
          <FloatingShape key={i} {...s} />
        ))}
      </motion.div>

      {/* Mouse parallax layer */}
      {!shouldReduceMotion && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ x: springMouseX, y: springMouseY }}
        >
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-terracotta/5 blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-gold/5 blur-3xl" />
        </motion.div>
      )}

      {/* Content */}
      <motion.div
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4"
        style={{ y: textY, opacity }}
      >
        {/* Pill badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.8 }}
          className="mb-6 inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-gold/20 rounded-full px-4 py-1.5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          <span className="text-gold font-dm text-xs tracking-[0.25em] uppercase">Salon Afro Spécialisé · Toulouse</span>
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.0 }}
          className="flex items-center gap-3 mb-5"
        >
          <div className="w-8 h-px bg-terracotta/60" />
          <span className="text-cream/50 font-dm text-xs tracking-[0.3em] uppercase">L&apos;art des tresses africaines</span>
          <div className="w-8 h-px bg-terracotta/60" />
        </motion.div>

        {/* Main title */}
        <div className="mb-6 overflow-hidden">
          <motion.h1
            className="font-playfair text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-cream font-bold leading-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            {titleWords.map((word, i) => (
              <motion.span
                key={i}
                className="inline-block mr-4"
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.7,
                  delay: 2 + i * 0.1,
                  ease: [0.33, 1, 0.68, 1],
                }}
              >
                {word === '&' ? (
                  <span className="text-terracotta">{word}</span>
                ) : (
                  word
                )}
              </motion.span>
            ))}
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.5 }}
          className="font-dm text-cream/60 text-base sm:text-lg md:text-xl max-w-xl mb-10 leading-relaxed"
        >
          Spécialiste des tresses africaines — box braids, tresses collées, vanilles, cornrows, locks et bien plus encore.
        </motion.p>

        {/* Dual CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.7 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link href="/reserver">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative bg-terracotta text-cream px-8 py-4 rounded-full font-dm text-sm tracking-wider uppercase overflow-hidden group shadow-glow"
            >
              <motion.span
                className="absolute inset-0 bg-terracotta-light"
                initial={{ x: '-100%' }}
                whileHover={{ x: '0%' }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative">Prendre rendez-vous</span>
            </motion.button>
          </Link>

          <Link href="/galerie">
            <motion.button
              whileHover={{ scale: 1.05, borderColor: 'rgba(212,168,83,0.6)' }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 border border-white/20 text-cream/80 hover:text-cream px-8 py-4 rounded-full font-dm text-sm tracking-wider uppercase transition-colors duration-300"
            >
              Voir la galerie
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >→</motion.span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.0, duration: 0.6 }}
          className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-8 sm:gap-12"
        >
          {[
            { value: '200+', label: 'Clientes' },
            { value: '5 ans', label: 'Expérience' },
            { value: '15+', label: 'Styles' },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="font-playfair text-xl font-bold text-gold">{stat.value}</span>
              <span className="font-dm text-xs text-cream/40 tracking-wider uppercase">{stat.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.4, duration: 0.6 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <motion.div
            className="w-5 h-8 border border-cream/20 rounded-full flex items-start justify-center pt-1.5"
          >
            <motion.div
              className="w-0.5 h-2 bg-cream/40 rounded-full"
              animate={{ y: [0, 8, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
