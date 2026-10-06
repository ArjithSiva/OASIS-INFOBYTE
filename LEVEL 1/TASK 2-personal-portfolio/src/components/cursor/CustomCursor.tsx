import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useMousePosition, useFinePointer } from '../../hooks/useMousePosition'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { RESUME_VIEWER_STATE_EVENT } from '../../lib/events'

export function CustomCursor() {
  const isFine = useFinePointer()
  const reducedMotion = useReducedMotion()
  const { x, y } = useMousePosition()
  const [hovering, setHovering] = useState(false)
  const [resumeViewerOpen, setResumeViewerOpen] = useState(false)
  const enabled = isFine && !reducedMotion && !resumeViewerOpen

  useEffect(() => {
    const onViewerState = (e: Event) => setResumeViewerOpen(Boolean((e as CustomEvent<boolean>).detail))
    window.addEventListener(RESUME_VIEWER_STATE_EVENT, onViewerState)
    return () => window.removeEventListener(RESUME_VIEWER_STATE_EVENT, onViewerState)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-cursor', enabled ? 'custom' : 'default')
  }, [enabled])

  useEffect(() => {
    if (!enabled) return
    const isInteractive = (el: EventTarget | null) =>
      el instanceof HTMLElement && !!el.closest('a, button, [role="button"], input, textarea')

    const onOver = (e: MouseEvent) => setHovering(isInteractive(e.target))
    window.addEventListener('mouseover', onOver)
    return () => window.removeEventListener('mouseover', onOver)
  }, [enabled])

  if (!enabled) return null

  const size = hovering ? 34 : 18
  const half = size / 2

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[1000]"
      style={{ width: size, height: size }}
      animate={{ x: x - half, y: y - half, width: size, height: size, opacity: hovering ? 0.85 : 1 }}
      transition={{
        x: { duration: 0 },
        y: { duration: 0 },
        default: { type: 'spring', stiffness: 700, damping: 40, mass: 0.4 },
      }}
    >
      {/* Thin ring */}
      <svg viewBox="0 0 34 34" width="100%" height="100%" className="absolute inset-0">
        <circle
          cx="17"
          cy="17"
          r={hovering ? 15 : 8}
          fill="none"
          stroke="var(--color-accent-3)"
          strokeWidth="1.5"
        />
      </svg>
      {/* Crosshair ticks */}
      <span
        className="absolute left-1/2 top-0 -translate-x-1/2"
        style={{ width: 1.5, height: 5, background: 'var(--color-accent-3)' }}
      />
      <span
        className="absolute left-1/2 bottom-0 -translate-x-1/2"
        style={{ width: 1.5, height: 5, background: 'var(--color-accent-3)' }}
      />
      <span
        className="absolute top-1/2 left-0 -translate-y-1/2"
        style={{ width: 5, height: 1.5, background: 'var(--color-accent-3)' }}
      />
      <span
        className="absolute top-1/2 right-0 -translate-y-1/2"
        style={{ width: 5, height: 1.5, background: 'var(--color-accent-3)' }}
      />
    </motion.div>
  )
}
