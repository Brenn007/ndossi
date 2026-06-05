'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  const cursorX = useMotionValue(-300)
  const cursorY = useMotionValue(-300)

  const spring = { damping: 30, stiffness: 200, mass: 0.5 }
  const springX = useSpring(cursorX, spring)
  const springY = useSpring(cursorY, spring)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return

    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      if (!isVisible) setIsVisible(true)
    }

    const onEnter = () => setIsHovering(true)
    const onLeave = () => setIsHovering(false)

    window.addEventListener('mousemove', move)

    const els = document.querySelectorAll(
      'a, button, [role="button"], input, label, select, textarea'
    )
    els.forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    return () => {
      window.removeEventListener('mousemove', move)
      els.forEach(el => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
      })
    }
  }, [cursorX, cursorY, isVisible])

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null
  }

  return (
    <>
      {/* Spotlight halo */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99998]"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={{
            width: isHovering ? 320 : 220,
            height: isHovering ? 320 : 220,
            opacity: isVisible ? 1 : 0,
          }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{
            borderRadius: '50%',
            background: isHovering
              ? 'radial-gradient(circle, rgba(212,168,83,0.18) 0%, rgba(196,98,45,0.08) 45%, transparent 70%)'
              : 'radial-gradient(circle, rgba(212,168,83,0.12) 0%, rgba(196,98,45,0.05) 40%, transparent 65%)',
          }}
        />
      </motion.div>

      {/* Inner glow ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99999]"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={{
            width: isHovering ? 44 : 28,
            height: isHovering ? 44 : 28,
            opacity: isVisible ? 1 : 0,
          }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          style={{
            borderRadius: '50%',
            border: '1.5px solid rgba(212,168,83,0.6)',
            boxShadow: isHovering
              ? '0 0 12px rgba(212,168,83,0.4), inset 0 0 8px rgba(212,168,83,0.1)'
              : '0 0 6px rgba(212,168,83,0.25)',
          }}
        />
      </motion.div>

      {/* Precise dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99999]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={{
            width: isHovering ? 5 : 4,
            height: isHovering ? 5 : 4,
            opacity: isVisible ? 1 : 0,
          }}
          transition={{ duration: 0.1 }}
          style={{
            borderRadius: '50%',
            backgroundColor: '#D4A853',
            boxShadow: '0 0 6px rgba(212,168,83,0.8)',
          }}
        />
      </motion.div>
    </>
  )
}
