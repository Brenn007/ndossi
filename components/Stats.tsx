'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

interface StatItem {
  value: number
  suffix: string
  label: string
  sublabel: string
  prefix?: string
}

const stats: StatItem[] = [
  { value: 200, suffix: '+', label: 'Clientes satisfaites', sublabel: 'et qui reviennent' },
  { value: 5, suffix: ' ans', label: "D'expérience", sublabel: 'en coiffure afro' },
  { value: 15, suffix: '+', label: 'Types de tresses', sublabel: 'maîtrisés' },
  { value: 100, suffix: '%', label: 'Satisfaction', sublabel: 'garantie à chaque visite' },
]

function Counter({ value, suffix, prefix, delay }: { value: number; suffix: string; prefix?: string; delay: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const shouldReduce = useReducedMotion()

  useEffect(() => {
    if (!isInView) return
    if (shouldReduce) {
      setCount(value)
      return
    }

    const duration = 1800
    const steps = 60
    const increment = value / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [isInView, value, shouldReduce])

  return (
    <span ref={ref} className="font-playfair text-4xl sm:text-5xl font-bold text-terracotta">
      {prefix}{count}{suffix}
    </span>
  )
}

export default function Stats() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section className="py-16 sm:py-24 bg-cream relative overflow-hidden" ref={sectionRef}>
      {/* Top accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-terracotta/40 to-transparent origin-left"
      />
      {/* Bottom accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent origin-right"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-chocolate/8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeOut' }}
              className="flex flex-col items-center text-center px-4 sm:px-8 py-4 group"
            >
              <Counter
                value={stat.value}
                suffix={stat.suffix}
                prefix={stat.prefix}
                delay={i * 0.2}
              />
              <div className="w-6 h-px bg-gold mt-3 mb-2 group-hover:w-10 transition-all duration-300" />
              <span className="font-playfair text-sm font-semibold text-dark/80 tracking-wide">{stat.label}</span>
              <span className="font-dm text-xs text-dark/40 mt-0.5">{stat.sublabel}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
