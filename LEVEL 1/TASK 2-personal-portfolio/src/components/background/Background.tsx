import { useTheme } from '../../hooks/useTheme'

/**
 * Fixed ambient backdrop. Supports content, never competes with it — kept
 * to low opacity per the design brief. Two layers cross-fade on theme
 * change instead of unmounting, so there's no flash of empty background.
 */
export function Background() {
  const { mode } = useTheme()
  const isShadow = mode === 'shadow'

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-surface transition-colors duration-700">
      {/* Shadow Mode — organic purple smoke */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{ opacity: isShadow ? 1 : 0 }}
        aria-hidden
      >
        <div
          className="animate-drift absolute -top-1/4 -left-1/4 h-[70vh] w-[70vh] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, var(--color-accent-3) 0%, transparent 70%)', opacity: 0.16 }}
        />
        <div
          className="animate-drift absolute top-1/3 -right-1/4 h-[60vh] w-[60vh] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, var(--color-accent) 0%, transparent 70%)', opacity: 0.14, animationDelay: '-8s' }}
        />
        <div
          className="animate-drift absolute bottom-0 left-1/3 h-[55vh] w-[55vh] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, var(--color-accent-2) 0%, transparent 70%)', opacity: 0.12, animationDelay: '-14s' }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(var(--color-line) 1px, transparent 1px), linear-gradient(90deg, var(--color-line) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            opacity: 0.15,
          }}
        />
      </div>

      {/* System Mode — sharp directional blue slashes */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{ opacity: isShadow ? 0 : 1 }}
        aria-hidden
      >
        <div
          className="absolute -top-1/3 right-0 h-[140%] w-[45%]"
          style={{
            background: 'linear-gradient(115deg, transparent 40%, var(--color-accent-3) 46%, transparent 52%)',
            opacity: 0.12,
          }}
        />
        <div
          className="absolute -top-1/3 right-[15%] h-[140%] w-[30%]"
          style={{
            background: 'linear-gradient(115deg, transparent 42%, var(--color-accent) 47%, transparent 53%)',
            opacity: 0.1,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(var(--color-line) 1px, transparent 1px), linear-gradient(90deg, var(--color-line) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            opacity: 0.18,
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 30% 20%, var(--color-accent-3) 0%, transparent 55%)', opacity: 0.1 }}
        />
      </div>
    </div>
  )
}
