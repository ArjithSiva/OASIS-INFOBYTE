import { useRef, useState, type MouseEvent, type ReactNode } from 'react'
import { motion, type MotionProps } from 'framer-motion'
import './SpotlightCard.css'

/**
 * React Bits' Spotlight Card (reactbits.dev/c/components/spotlight-card),
 * adapted to render as a `motion.a` so it can double as a link card, and
 * themed via `spotlightColor` instead of a hardcoded hex — pass
 * `rgba(${accentRgb(mode)}, alpha)` so it flips with Shadow/System mode.
 */
interface SpotlightCardProps extends MotionProps {
  href: string
  target?: string
  rel?: string
  spotlightColor?: string
  className?: string
  children: ReactNode
}

export function SpotlightCard({
  href,
  target,
  rel,
  spotlightColor = 'rgba(255, 255, 255, 0.25)',
  className = '',
  children,
  ...motionProps
}: SpotlightCardProps) {
  const ref = useRef<HTMLAnchorElement | null>(null)
  const [opacity, setOpacity] = useState(0)

  const handleMouseMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--spotlight-x', `${e.clientX - rect.left}px`)
    el.style.setProperty('--spotlight-y', `${e.clientY - rect.top}px`)
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      target={target}
      rel={rel}
      className={`spotlight-card ${className}`.trim()}
      style={{ '--spotlight-color': spotlightColor } as React.CSSProperties}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      {...motionProps}
    >
      <span className="spotlight-card__glow" style={{ opacity }} aria-hidden="true" />
      <span className="spotlight-card__border" aria-hidden="true" />
      <span className="spotlight-card__content">{children}</span>
    </motion.a>
  )
}
