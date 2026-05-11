'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Don't enable lenis if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenisRef.current = lenis

    let animationId: number

    function raf(time: number) {
      lenis.raf(time)
      animationId = requestAnimationFrame(raf)
    }

    animationId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(animationId)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
