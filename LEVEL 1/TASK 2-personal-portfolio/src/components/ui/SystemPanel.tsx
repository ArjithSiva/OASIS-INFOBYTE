import type { ReactNode } from 'react'

interface SystemPanelProps {
  children: ReactNode
  /** Classes applied to the inner content box — padding, flex, etc. */
  className?: string
  /** Smaller corner-cut/bar thickness, for compact cards (repo cards). */
  size?: 'md' | 'sm'
  /** Stretch to fill a grid/flex cell's full height (equal-height cards). */
  fullHeight?: boolean
  /** Show the tick-mark "circuit trace" accents down the sides. Defaults
   *  to on for size="md" and off for size="sm" (too cramped there), but
   *  can be set explicitly either way. */
  trace?: boolean
}

// The Solo Leveling "system window" panel used for every card site-wide:
// a stepped, glowing ribbon across the top and bottom, tick-mark traces
// down the sides, and a white-outlined content box in the middle. See the
// .sw-panel rules in src/index.css for how the layers work together — this
// component just guarantees every card renders the same markup instead of
// each caller hand-rolling it.
export function SystemPanel({
  children,
  className = '',
  size = 'md',
  fullHeight = false,
  trace,
}: SystemPanelProps) {
  const h = fullHeight ? 'h-full' : ''
  const showTrace = trace ?? size === 'md'
  return (
    <div className={`sw-panel ${size === 'sm' ? 'sw-panel--sm' : ''} ${h}`}>
      <div className="sw-panel__glow" aria-hidden="true" />
      <div className="sw-panel__bar sw-panel__bar--top" aria-hidden="true" />
      <div className="sw-panel__bar sw-panel__bar--bottom" aria-hidden="true" />
      {showTrace && (
        <>
          <div className="sw-panel__trace sw-panel__trace--left" aria-hidden="true" />
          <div className="sw-panel__trace sw-panel__trace--right" aria-hidden="true" />
        </>
      )}
      <div className={`sw-panel__frame ${h}`}>
        <div className={`sw-panel__inner ${h} ${className}`}>{children}</div>
      </div>
    </div>
  )
}
