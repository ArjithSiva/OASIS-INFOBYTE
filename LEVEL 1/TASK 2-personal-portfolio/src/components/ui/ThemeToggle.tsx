import { Moon, Radar } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { mode, toggle, transitioning } = useTheme()
  const isShadow = mode === 'shadow'

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={transitioning}
      aria-label={`Switch to ${isShadow ? 'System' : 'Shadow'} Mode`}
      className={`font-mono uppercase tracking-[0.18em] flex items-center gap-2 border border-line-strong text-ink transition-all duration-300 hover:border-accent hover-glow disabled:opacity-60 ${
        compact ? 'px-3 py-2 text-[0.6rem]' : 'px-4 py-2.5 text-xs'
      }`}
    >
      {isShadow ? <Moon size={14} className="text-accent-3" /> : <Radar size={14} className="text-accent-3" />}
      <span>{isShadow ? 'Shadow Mode' : 'System Mode'}</span>
    </button>
  )
}
