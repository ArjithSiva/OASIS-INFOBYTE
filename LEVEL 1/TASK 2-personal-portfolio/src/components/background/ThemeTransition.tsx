import { AnimatePresence, motion } from 'framer-motion'
import { useTheme, usePendingMode } from '../../hooks/useTheme'

/**
 * The one deliberately dramatic animation on the site: a diagonal sweep in
 * the *target* theme's color that covers the viewport, the actual theme
 * swaps underneath while fully covered, then the sweep continues off the
 * far edge to reveal it. Skipped entirely under prefers-reduced-motion
 * (ThemeProvider swaps instantly in that case and transitioning stays false).
 */
export function ThemeTransition() {
  const { transitioning } = useTheme()
  const pendingMode = usePendingMode()

  const toSystem = pendingMode === 'system'

  return (
    <AnimatePresence>
      {transitioning && (
        <motion.div className="fixed inset-0 z-[999] pointer-events-none overflow-hidden" aria-hidden>
          <motion.div
            className="absolute inset-y-0"
            style={{
              width: '180%',
              left: '-40%',
              transform: 'skewX(-14deg)',
              background: toSystem
                ? 'linear-gradient(100deg, #d5f0ff 0%, #8fd4f5 35%, #0ea5ec 50%, #8fd4f5 65%, #d5f0ff 100%)'
                : 'linear-gradient(100deg, #030005 0%, #16052b 35%, #7c3aed 50%, #16052b 65%, #030005 100%)',
              boxShadow: toSystem ? '0 0 120px 40px rgba(14,165,236,0.45)' : '0 0 120px 40px rgba(124,58,237,0.55)',
            }}
            initial={{ x: '-100%' }}
            animate={{ x: ['-100%', '0%', '100%'] }}
            transition={{ duration: 0.9, times: [0, 0.46, 1], ease: 'easeInOut' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
