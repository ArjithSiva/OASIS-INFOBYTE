import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type Mode = 'shadow' | 'system'

interface ThemeContextValue {
  mode: Mode
  /** True for the ~800ms the transition sweep is on screen. */
  transitioning: boolean
  toggle: () => void
  setMode: (mode: Mode) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const STORAGE_KEY = 'portfolio-mode'

function getInitialMode(): Mode {
  if (typeof window === 'undefined') return 'shadow'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'shadow' || stored === 'system') return stored
  // No stored preference yet — mirror the visitor's device: a light-mode
  // device gets System Mode, a dark-mode (or no-preference) device gets
  // Shadow Mode. Whatever they pick afterwards is remembered and takes
  // over from here.
  if (window.matchMedia?.('(prefers-color-scheme: light)').matches) {
    return 'system'
  }
  return 'shadow'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<Mode>(getInitialMode)
  const [transitioning, setTransitioning] = useState(false)
  const [pendingMode, setPendingMode] = useState<Mode | null>(null)

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode)
    window.localStorage.setItem(STORAGE_KEY, mode)

    // Keep the tab favicon in step with the theme — a static file can't
    // read data-theme on its own, so swap the <link> itself. index.html
    // does the same thing inline before first paint to avoid a flash.
    const favicon = document.getElementById('favicon') as HTMLLinkElement | null
    if (favicon) favicon.href = `${import.meta.env.BASE_URL}favicon-${mode}.svg`
  }, [mode])

  const setMode = useCallback(
    (next: Mode) => {
      if (next === mode || transitioning) return

      if (prefersReducedMotion) {
        setModeState(next)
        return
      }

      setPendingMode(next)
      setTransitioning(true)

      // Swap the underlying theme once the transition sweep has fully
      // covered the viewport, so the reveal shows the new theme already in
      // place rather than snapping visibly.
      const swap = window.setTimeout(() => {
        setModeState(next)
      }, 420)

      const done = window.setTimeout(() => {
        setTransitioning(false)
        setPendingMode(null)
      }, 900)

      return () => {
        window.clearTimeout(swap)
        window.clearTimeout(done)
      }
    },
    [mode, transitioning, prefersReducedMotion],
  )

  const toggle = useCallback(() => {
    setMode(mode === 'shadow' ? 'system' : 'shadow')
  }, [mode, setMode])

  const value = useMemo(
    () => ({ mode, transitioning, toggle, setMode, pendingMode }),
    [mode, transitioning, toggle, setMode, pendingMode],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}

// Exposed separately so ThemeTransition can read the in-flight target
// without every consumer of useTheme() needing it.
export function usePendingMode(): Mode | null {
  const ctx = useContext(ThemeContext) as (ThemeContextValue & { pendingMode: Mode | null }) | null
  return ctx?.pendingMode ?? null
}
